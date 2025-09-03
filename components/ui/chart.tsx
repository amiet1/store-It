"use client";

import * as React from "react";
import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Label,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PolarRadiusAxis,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RadialBar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  RadialBarChart,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ReferenceLine,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn } from "@/lib/utils";

// Types from Recharts
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
  };
};

const ChartContext = React.createContext<{ config: ChartConfig }>({
  config: {},
});

export function useChart() {
  return React.useContext(ChartContext);
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { config: ChartConfig }
  // eslint-disable-next-line react/prop-types
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = id ?? uniqueId.replace(/:/g, "");

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn("flex aspect-video justify-center text-xs", className)}
        {...props}
      >
        {children}
        <ChartStyle id={chartId} config={config} />
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colorConfig = Object.entries(config).filter(([, conf]) => conf?.color);

  if (!colorConfig.length) return null;

  return (
    <style>
      {colorConfig.map(([key, conf]) =>
        conf?.color
          ? `
          [data-chart=${id}] [data-chart-color=${key}] {
            color: ${conf.color};
            --color-${key}: ${conf.color};
          }
        `
          : null,
      )}
    </style>
  );
}

// ------------------ Tooltip ------------------

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: Payload<ValueType, NameType>[];
  label?: string;
  className?: string;
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "line" | "dot" | "dashed";
  nameKey?: string;
  labelKey?: string;
  formatter?: (
    value: ValueType,
    name: NameType,
    item: Payload<ValueType, NameType>,
    index: number,
    payload: unknown,
  ) => React.ReactNode;
  labelFormatter?: (
    label: unknown,
    payload: Payload<ValueType, NameType>[],
  ) => React.ReactNode;
  labelClassName?: string;
  color?: string;
};

export const ChartTooltip = RechartsTooltip;

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  ChartTooltipContentProps
>(
  (
    {
      active,
      payload,
      label,
      className,
      hideLabel = false,
      hideIndicator = false,
      indicator = "dot",
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      nameKey,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      labelKey,
      formatter,
      labelFormatter,
      labelClassName,
      color,
    },
    ref,
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const tooltipLabel = labelFormatter
      ? labelFormatter(label, payload)
      : label;

    return (
      <div
        ref={ref}
        className={cn(
          "z-50 min-w-[8rem] rounded-lg border bg-background p-2 shadow-xl",
          className,
        )}
      >
        {!hideLabel && (
          <div
            className={cn("mb-2 font-medium text-foreground", labelClassName)}
          >
            {tooltipLabel}
          </div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${item.dataKey}-${index}`;
            const indicatorColor =
              color ??
              config[item.dataKey as string]?.color ??
              "hsl(var(--foreground))";

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  {!hideIndicator && (
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        indicator === "line" && "h-0.5 w-3 rounded-none",
                        indicator === "dashed" &&
                          "h-0.5 w-3 rounded-none border border-dashed",
                      )}
                      style={{ backgroundColor: indicatorColor }}
                    />
                  )}
                  <span className="text-muted-foreground">
                    {config[item.dataKey as string]?.label ?? item.name}
                  </span>
                </div>
                <span className="font-medium">
                  {formatter
                    ? formatter(
                        item.value as ValueType,
                        item.name as NameType,
                        item,
                        index,
                        payload,
                      )
                    : item.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// ------------------ Legend ------------------

type ChartLegendContentProps = {
  payload?: Array<{ value: string; dataKey: string; color: string }>;
  className?: string;
};

export const ChartLegendContent = ({
  payload,
  className,
}: ChartLegendContentProps) => {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      {payload.map((item) => {
        const key = item.dataKey || item.value;
        const legendColor =
          config[item.dataKey]?.color ?? item.color ?? "hsl(var(--foreground))";

        return (
          <div
            key={key}
            className="flex items-center gap-2"
            data-chart-legend={item.dataKey}
          >
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: legendColor }}
            />
            <span className="text-sm text-muted-foreground">
              {config[item.dataKey]?.label ?? item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};
