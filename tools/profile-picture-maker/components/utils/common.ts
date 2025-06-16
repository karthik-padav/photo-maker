export function myPhotoControlers() {
  return [
    {
      label: "Rotate",
      attr: {
        min: 0,
        max: 360,
        step: 10,
        name: "rotate",
      },
    },
    {
      label: "Zoom",
      attr: {
        min: 0.5,
        max: 2,
        step: 0.1,
        name: "scale",
      },
    },
    {
      label: "Outline",
      attr: {
        min: 0,
        max: 5,
        step: 1,
        name: "pngShadow",
      },
    },
  ];
}

export function borderControlers() {
  return [
    {
      label: "Border Thickness",
      attr: {
        min: 0,
        max: 100,
        step: 10,
        name: "outerBorderWidth",
      },
    },
    {
      label: "Border Radius",
      attr: {
        min: 0,
        max: 50,
        step: 5,
        name: "outerBorderRadius",
      },
    },
    {
      label: "Border Opacity",
      attr: {
        min: 0,
        max: 1,
        step: 0.1,
        name: "outerBorderOpacity",
      },
    },
  ];
}

export function bgControlers() {
  return [
    {
      label: "Background Rotate",
      attr: {
        min: 0,
        max: 360,
        step: 20,
        name: "backgroundRotate",
      },
    },
    {
      label: "Zoom",
      attr: {
        min: 0.5,
        max: 3,
        step: 0.1,
        name: "backgroundScale",
      },
    },
  ];
}
