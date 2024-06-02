const connectorMap: Map<string, string> = new Map<string, string>();


connectorMap.set("0_0_0_0", "");
connectorMap.set("0.5_0_1_0.5", "╰");
connectorMap.set("1_0.5_0.5_0", "╰");

connectorMap.set("0.5_0_0_0.5", "╯");
connectorMap.set("0_0.5_0.5_0", "╯");

connectorMap.set("0_0.5_0.5_1", "╮");
connectorMap.set("0.5_1_0_0.5", "╮");

connectorMap.set("1_0.5_0.5_1", "╭");
connectorMap.set("0.5_1_1_0.5", "╭");

connectorMap.set("0_1_1_0", "╱");
connectorMap.set("1_0_0_1", "╱");

connectorMap.set("0_0_1_1", "╲");
connectorMap.set("1_1_0_0", "╲");

connectorMap.set("0_1_1_1", "_");
connectorMap.set("1_1_0_1", "_");
connectorMap.set("0_1_0.5_1", "_");
connectorMap.set("0.5_1_0_1", "_");
connectorMap.set("1_1_0.5_1", "_");
connectorMap.set("1_1_0.5_1", "_");

connectorMap.set("0_0_1_0", "⎺");
connectorMap.set("1_0_0_0", "⎺");
connectorMap.set("0_0_0.5_0", "⎺");
connectorMap.set("0.5_0_0_0", "⎺");
connectorMap.set("0.5_0_1_0", "⎺");
connectorMap.set("1_0_0.5_0", "⎺");

connectorMap.set("1_1_1_0", "▕");
connectorMap.set("1_0_1_1", "▕");
connectorMap.set("1_0.5_1_0", "▕");
connectorMap.set("1_0_1_0.5", "▕");
connectorMap.set("1_1_1_0.5", "▕");
connectorMap.set("1_0.5_1_1", "▕");

connectorMap.set("0_1_0_0", "");
connectorMap.set("0_0_0_1", "▏");
connectorMap.set("0_1_0_0.5", "▏");
connectorMap.set("0_0.5_0_1", "▏");
connectorMap.set("0_0.5_0_0", "▏");
connectorMap.set("0_0_0_0.5", "▏");

connectorMap.set("0.5_0_0.5_1", "│");
connectorMap.set("0.5_1_0.5_0", "│");

connectorMap.set("0_0.5_1_0.5", "─");
connectorMap.set("1_0.5_0_0.5", "─");

connectorMap.set("0_1_0.5_0", "⎭");
connectorMap.set("0.5_0_0_1", "⎭");

connectorMap.set("1_1_0.5_0", "⎩");
connectorMap.set("0.5_0_1_1", "⎩");

connectorMap.set("0_0_0.5_1", "⎫");
connectorMap.set("0.5_1_0_0", "⎫");

connectorMap.set("1_0_0.5_1", "⎧");
connectorMap.set("0.5_1_1_0", "⎧");

connectorMap.set("0_1_0.5_1", "_");
connectorMap.set("0.5_1_0_1", "_");
connectorMap.set("1_1_0.5_1", "_");
connectorMap.set("1_1_0.5_1", "_");

connectorMap.set("0_0.5_1_0", "/");
connectorMap.set("1_0_0_0.5", "/");
connectorMap.set("1_0.5_0_1", "/");
connectorMap.set("0_1_1_0.5", "/");

connectorMap.set("0_0_1_0.5", "\\");
connectorMap.set("1_0.5_0_0", "\\");
connectorMap.set("1_0.5_1_1", "\\");
connectorMap.set("1_1_1_0.5", "\\");
connectorMap.set("0_0.5_1_1", "\\");
connectorMap.set("1_1_0_0.5", "\\");

export { connectorMap };
