// this file should store all the basic shapes that require interactions i.e. non person figure shapes

// types of canvas elements
export type CanvasElementType = 'figure' | 'simpleShape';

// parent interface for all canvas element types
export interface CanvasElement {
  type: CanvasElementType;
}

// star shape interface
export interface StarShape extends CanvasElement {
  type: 'simpleShape';
  id: string;
  x: number;
  y: number;
  rotation: number;
  isDragging: boolean;
}

// function generateShapes() {
//   // ensure that the shapes are auto generated within the bounds of the canvas
//   const canvasElement = canvasRef.current;
//   const padding = 50;

//   function randomNumber(min: number, max: number) {
//     return Math.random() * (max - min) + min;
//   }

//   if (canvasElement) {
//     const canvasRect = canvasElement.getBoundingClientRect();

//     return [...Array(10)].map((_, i) => ({
//       id: i.toString(),
//       x: 720,
//       y: 521,
//       // x: canvasRect.left + canvasRect.width / 2,
//       // y: canvasRect.top + canvasRect.height / 2,
//       rotation: Math.random() * 180,
//       isDragging: false,
//     }));
//   }
//   return [];
// }

// const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
//   const dragId = e.target.attrs.id;
//   setStars(
//     stars.map(star => {
//       let newX = star.x;
//       let newY = star.y;

//       if (star.id === dragId) {
//         newX = e.target.position().x;
//         newY = e.target.position().y;
//       }

//       return {
//         ...star,
//         x: newX,
//         y: newY,
//       };
//     }),
//   );
// };

// const handleDragStart = (e: KonvaEventObject<DragEvent>) => {
//   const dragId = e.target.attrs.id;
//   setStars(
//     stars.map(star => {
//       return {
//         ...star,
//         isDragging: star.id === dragId,
//       };
//     }),
//   );
// };

// const handleDragEnd = (e: KonvaEventObject<DragEvent>) => {
//   const dragId = e.target.attrs.id;
//   setStars(
//     stars.map(star => {
//       return {
//         ...star,
//         isDragging: false,
//       };
//     }),
//   );
// };
