import { describe, expect, it } from "vitest";
import { toLivePrediction, isNoiseFlagged, MIN_SAMPLE_COUNT } from "@/lib/statUtils";
import type { ChangeStatsRow } from "@/lib/statUtils";

function row(overrides: Partial<ChangeStatsRow> = {}): ChangeStatsRow {
  return {
    avg_change: 5,
    min_change: 2,
    max_change: 8,
    stddev_change: 1.5,
    sample_count: 4,
    ...overrides,
  };
}

describe("toLivePrediction", () => {
  it("returns insufficient-data result when sample_count is below the threshold", () => {
    const result = toLivePrediction("T0+24h", row({ sample_count: MIN_SAMPLE_COUNT - 1 }));

    expect(result.sampleCount).toBe(MIN_SAMPLE_COUNT - 1);
    expect(result.expectedChangeLow).toBeNull();
    expect(result.expectedChangeHigh).toBeNull();
    expect(result.confidence).toBeNull();
  });

  it("returns insufficient-data result when avg_change is null even if sample_count is high", () => {
    const result = toLivePrediction("T0+24h", row({ sample_count: 10, avg_change: null }));

    expect(result.expectedChangeLow).toBeNull();
    expect(result.confidence).toBeNull();
  });

  it("maps offset labels to the correct prediction horizon", () => {
    expect(toLivePrediction("T0+24h", row()).horizon).toBe("24s");
    expect(toLivePrediction("T0+1w", row()).horizon).toBe("1h");
  });

  it("computes a range centered on avg_change, widened by stddev", () => {
    const result = toLivePrediction("T0+24h", row({ avg_change: 5, stddev_change: 1.5 }));

    expect(result.expectedChangeLow).toBe(3.5);
    expect(result.expectedChangeHigh).toBe(6.5);
  });

  it("floors the range half-width at 0.5 when stddev is near zero", () => {
    const result = toLivePrediction("T0+24h", row({ avg_change: 5, stddev_change: 0 }));

    expect(result.expectedChangeLow).toBe(4.5);
    expect(result.expectedChangeHigh).toBe(5.5);
  });

  it("increases confidence with more samples and decreases it with more spread", () => {
    const moreSamples = toLivePrediction("T0+24h", row({ sample_count: 10, stddev_change: 1 }));
    const fewerSamples = toLivePrediction("T0+24h", row({ sample_count: 2, stddev_change: 1 }));
    const highSpread = toLivePrediction("T0+24h", row({ sample_count: 10, stddev_change: 10 }));

    expect(moreSamples.confidence!).toBeGreaterThan(fewerSamples.confidence!);
    expect(moreSamples.confidence!).toBeGreaterThan(highSpread.confidence!);
  });

  it("clamps confidence between 30 and 95", () => {
    const veryConfident = toLivePrediction("T0+24h", row({ sample_count: 1000, stddev_change: 0 }));
    const veryUncertain = toLivePrediction(
      "T0+24h",
      row({ sample_count: MIN_SAMPLE_COUNT, stddev_change: 1000 })
    );

    expect(veryConfident.confidence).toBe(95);
    expect(veryUncertain.confidence).toBe(30);
  });
});

describe("isNoiseFlagged", () => {
  it("never flags high-trust sources, regardless of accuracy", () => {
    expect(isNoiseFlagged(97, null)).toBe(false);
    expect(isNoiseFlagged(97, 0)).toBe(false);
    expect(isNoiseFlagged(30, null)).toBe(false);
  });

  it("flags low-trust sources with no accuracy track record yet", () => {
    expect(isNoiseFlagged(18, null)).toBe(true);
  });

  it("flags low-trust sources with a poor accuracy track record", () => {
    expect(isNoiseFlagged(18, 49.99)).toBe(true);
  });

  it("does not flag low-trust sources once they have a proven track record", () => {
    expect(isNoiseFlagged(18, 50)).toBe(false);
    expect(isNoiseFlagged(18, 87)).toBe(false);
  });
});
