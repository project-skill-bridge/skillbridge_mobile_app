// import GameScreen from '../../game-screen';

// /**
//  * First, we need to extract the getProgressPercentage function
//  * from the GameScreen component for testing purposes.
//  */
// // This extracts the function by examining the GameScreen component source
// const extractGetProgressPercentage = () => {
//   const gameScreenStr = GameScreen.toString();
//   const fnMatch = gameScreenStr.match(/const getProgressPercentage = \((.*?)\) => {([\s\S]*?)};/);
  
//   if (!fnMatch) {
//     throw new Error('Could not extract getProgressPercentage function');
//   }
  
//   // Use Function constructor to create a function from the extracted code
//   return new Function(
//     fnMatch[1], // parameter name
//     fnMatch[2] // function body
//   );
// };

// // Extract the function
// const getProgressPercentage = extractGetProgressPercentage();

// /**
//  * getProgressPercentage Utility Tests
//  * 
//  * These tests verify that the utility correctly calculates
//  * progress percentage based on the current game level.
//  */
// describe('getProgressPercentage Utility', () => {
//   // Test each level's progress percentage
//   test('returns 0% for level 1', () => {
//     expect(getProgressPercentage(1)).toBe(0);
//   });

//   test('returns 20% for level 2', () => {
//     expect(getProgressPercentage(2)).toBe(20);
//   });

//   test('returns 40% for level 3', () => {
//     expect(getProgressPercentage(3)).toBe(40);
//   });

//   test('returns 60% for level 4', () => {
//     expect(getProgressPercentage(4)).toBe(60);
//   });

//   test('returns 80% for level 5', () => {
//     expect(getProgressPercentage(5)).toBe(80);
//   });

//   // Test edge cases
//   test('returns 0% for invalid levels', () => {
//     expect(getProgressPercentage(0)).toBe(0);
//     expect(getProgressPercentage(6)).toBe(0);
//     expect(getProgressPercentage(-1)).toBe(0);
//   });
// })