![GitHub](https://img.shields.io/badge/GitHub-Profile-black): [mk197d](https://github.com/mk197d)

# TexEtch

TexEtch is a Visual Studio Code extension designed to convert diagrams drawn in [draw.io](https://app.diagrams.net/) into text format. This text format can be easily integrated into your code base to provide better explanations and documentation for your code.

## Features

- **Diagram to Text Conversion**: Convert complex diagrams from draw.io into readable text format.
- **Seamless Integration**: Easily integrate the converted text into your codebase to enhance documentation.
- **Support for Multiple Diagram Types**: Handles a variety of diagram types and structures.
- **User-friendly Interface**: Simple and intuitive interface for easy conversion.

## Installation

The extension can be installed from Visual Studio Code Marketplace.

## Usage
1. Open the draw.io website or application and create a file containing your desired diagram.
2. Navigate to File -> Export as -> XML and download the file.
![Step 1](Step1.png)
3. In Visual Studio Code, open the command palette by pressing Ctrl+Shift+P (Windows/Linux) or Cmd+Shift+P (macOS).
4. Type TexEtch and select the corresponding command.
![Step 2](Step2.png)
5. An Open Dialog box will appear, prompting you to select the required .xml file.
![Step 3](Step3.png)
6. After selecting the file, the output will be displayed in an output channel named TexEtch_out.
![Step 4](Step4.png)
7. To view the output in the editor as a file, go to the output channel and use the "Views and More Actions..." option.
![Step 5](Step5.png)

## Supported Figures

- **Horizontal and Vertical lines**: Line, Dashed Line, Dotted Line, Directional and Bidirectional Connector and Arrow.
![Lines](Lines2.png)
    Support for slanted lines coming soon!

- **Circle and Ellipse**
<div style="display: flex; align-items: center;">
  <img src="Circle.png" alt="Circle" width="25%">
  <img src="Ellipse.png" alt="Ellipse" width="50%">
</div>

- **Text**
    - Use text size as **11** in the draw.io editor to match the exact ratio of figures and text in the final output.
    - Avoid copying text from sources with colorful text to prevent disperancies in the output.

- **Rectangle** 