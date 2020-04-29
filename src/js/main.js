// var startPos = null;
var weigth = 0;
var delta = 0;
// console.log(window.weigth);

interact("#dropzone").dropzone({
  // only accept elements matching this CSS selector
  accept: ".draggable",
  // Require a 75% element overlap for a drop to be possible
  overlap: 0.5,
  ondropactivate: function (event) {},
  ondragenter: function (event) {
    if (event.detail !== "inertia") {
      let dropRect = interact.getElementRect(event.target);
      let dragRect = interact.getElementRect(event.relatedTarget);

      let dumbbel = event.relatedTarget;

      let numberOfDumbbel = parseFloat(dumbbel.getAttribute("number"));
      let quantity = parseFloat(dumbbel.getAttribute("quantity"));
      let weightOfDumbbel = parseFloat(dumbbel.getAttribute("weight"));

      dropCenter = {
        x: dropRect.left + (dropRect.width / (quantity + 1)) * numberOfDumbbel,
        y: dropRect.top + dropRect.height - dragRect.height / 2,
      };
      // console.log(dropCenter);
      // console.log(dropRect.left);
      // console.log(dropRect.width, quantity, numberOfDumbbel);
      event.interactable.snap({ anchors: [dropCenter] });

      // dragCenter = {
      //   x: dragRect.left + dragRect.width / 2,
      //   y: dragRect.top + dragRect.height / 2,
      // };

      // let x1 = dropRect.left;
      // let x2 = dropRect.left + dropRect.width;
      // let y1 = dropRect.top;
      // let y2 = dropRect.top + dropRect.height;

      // console.log(x1, x2);
      // console.log(y1, y2);
      // console.log(dropCenter);
      // console.log(dropCenter.x + 50, dropCenter.x - 50);
      // console.log(event.clientX0);
      // console.log(event);

      // let dx = event.clientX0;
      // let dX1 = dropCenter.x + 50;
      // let dX2 = dropCenter.x - 50;

      // let dy = event.clientY0;
      // let dY1 = dropCenter.y + 50;
      // let dY2 = dropCenter.y - 50;

      // if (dx < dX1 && dx > dX2 && dy < dY1 && dy > dY2) {
      //   console.log("hop");
      //   return null;
      // }

      // if (
      //   dragCenter.x > x2 ||
      //   dragCenter.x < x1 ||
      //   dragCenter.y > y2 ||
      //   dragCenter.y < y1 // event.speed < 1000
      // ) {
      let toggle = event.relatedTarget.getAttribute("toggle");
      // console.log(toggle, "enter");

      if (toggle == "false" || toggle === null) {
        // console.log(weightOfDumbbel);
        weigth += weightOfDumbbel;
        delta = weightOfDumbbel;
        // console.log(weigth);
      }
      event.relatedTarget.setAttribute("toggle", true);
      // add animation class
    }
  },
  ondragleave: function (event) {
    if (event.detail !== "inertia") {
      // snapping block
      event.draggable.snap(false);

      let xStart = event.relatedTarget.getAttribute("data-x0");
      let yStart = event.relatedTarget.getAttribute("data-y0");

      let startPos = {
        x: xStart,
        y: yStart,
      };
      event.interactable.snap({ anchors: [startPos] });

      // weight block

      let toggle = event.relatedTarget.getAttribute("toggle");
      // console.log(toggle, "leave");

      if (toggle) {
        let weightOfDumbbel = parseFloat(
          event.relatedTarget.getAttribute("weight")
        );

        weigth = weigth - weightOfDumbbel;
        delta = -weightOfDumbbel;
        // console.log(delta);
        // console.log(weigth);
      }
      event.relatedTarget.setAttribute("toggle", false);

      console.log(toggle);

      // move block
      console.log(delta);

      let dropzone = document.querySelector("#right");
      let left = document.querySelector("#left");

      let yDumbbel = (delta / 1000) * 14;
      delta = 0;
      let yDropZone = (weigth / 1000) * 14;
      let yLeft = 70 - 1 * yDropZone;

      console.log(yDumbbel, yDropZone);

      dropzone.style.webkitTransform = dropzone.style.transform =
        "translateY(" + yDropZone + "px)";
      left.style.webkitTransform = left.style.transform =
        "translateY(" + yLeft + "px)";

      let drop = event.relatedTarget.getAttribute("drop");
      // if draggable element have droped previously, then system can move dumbbel on leave
      if (drop === "true") {
        dragMoveAllDumbbels(0, yDumbbel);
      }

      event.relatedTarget.setAttribute("drop", false);
    }
  },
  ondrop: function (event) {
    // move all (means draggable elements with dropzone)

    let dropzone = document.querySelector("#right");
    let left = document.querySelector("#left");
    event.relatedTarget.classList.add("draggable-animated");

    // console.log(delta);
    let yDumbbel = (delta / 1000) * 13.5;
    delta = 0;
    let yDropZone = (weigth / 1000) * 13.5;
    let yLeft = 70 - 1 * yDropZone;

    // console.log(y);
    dropzone.style.webkitTransform = dropzone.style.transform =
      "translateY(" + yDropZone + "px)";
    left.style.webkitTransform = left.style.transform =
      "translateY(" + yLeft + "px)";

    dragMoveAllDumbbels(0, yDumbbel);

    event.relatedTarget.setAttribute("drop", true);

    // setTimeout(() => {
    //   event.relatedTarget.classList.remove("draggable-animated");
    // }, 1000);
  },
  ondropdeactivate: function (event) {},
});

interact(".draggable")
  .draggable({
    // inertia: true,
    onmove: dragMoveListener,
    onstart: function (event) {},
  })
  .inertia({
    // resistance: 100,
    // maxSpeed: 100,
  })
  .autoScroll(true)

  .restrict({
    drag: null,
    endOnly: true,
    elementRect: { top: 0, left: 0, bottom: 1, right: 1 },
  })
  .snap({
    mode: "anchor",
    anchors: [],
    range: Infinity,
    elementOrigin: { x: 0.5, y: 0.5 },
    endOnly: true,
  })
  .on("dragstart", function (event) {
    // let startPos = null;
    // let target = event.target
    let rect = interact.getElementRect(event.target);
    let xStart = event.target.getAttribute("data-x0");
    let yStart = event.target.getAttribute("data-y0");
    // console.log(xStart, yStart);

    if (!xStart && !yStart) {
      // console.log("hop");
      xStart = rect.left + rect.width / 2;
      yStart = rect.top + rect.height / 2;
      // console.log(xStart, yStart);

      event.target.setAttribute("data-x0", xStart);
      event.target.setAttribute("data-y0", yStart);
    }

    let startPos = {
      x: xStart,
      y: yStart,
    };

    let toggle = event.target.getAttribute("toggle");
    if (toggle) {
      event.target.classList.remove("draggable-animated");
    }

    // console.log(target)

    // if (!startPos) {
    //   // record center point when starting the very first a drag

    // }

    // snap to the start position
    event.interactable.snap({ anchors: [startPos] });
  });

function dragMoveListener(event) {
  // console.log(event);
  var target = event.target;
  // console.log(event.modifiers[0].target.source);
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // translate the element
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

function dragMoveAllDumbbels(dx, dy) {
  let dumbbels = document.querySelectorAll(".draggable");
  // console.log(dumbbels);

  let dumbbelsArray = Array.from(dumbbels);

  let filteredDumbbelsArray = dumbbelsArray.filter((dumbbel) => {
    let toggle = dumbbel.getAttribute("toggle");
    // console.log(toggle);
    return toggle == "true";
  });

  // console.log(filteredDumbbelsArray);

  for (const dumbbel of filteredDumbbelsArray) {
    const x = (parseFloat(dumbbel.getAttribute("data-x")) || 0) + dx;
    const y = (parseFloat(dumbbel.getAttribute("data-y")) || 0) + dy;

    dumbbel.style.webkitTransform = dumbbel.style.transform =
      "translate(" + x + "px, " + y + "px)";

    dumbbel.setAttribute("data-x", x);
    dumbbel.setAttribute("data-y", y);
  }
}

// this function is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;
