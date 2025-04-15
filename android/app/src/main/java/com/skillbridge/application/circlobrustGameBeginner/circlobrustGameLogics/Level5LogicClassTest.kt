/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustGameLogics

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class Level5LogicClassTest {

    private lateinit var level5Logic: Level5LogicClass

    @Before
    fun setUp() {
        level5Logic = Level5LogicClass()
    }

    @Test
    fun testInitialState() {
        assertEquals(0, level5Logic.score)
        assertFalse(level5Logic.gameEnded)
        // Add more initial state assertions as needed
    }

    @Test
    fun testIncrementScore() {
        level5Logic.incrementScore()
        assertEquals(1, level5Logic.score)
    }

    @Test
    fun testCheckScore_levelComplete() {
        level5Logic.score = 10 // Assuming 10 is the winning score
        assertTrue(level5Logic.checkScore())
        assertTrue(level5Logic.gameEnded)
    }

    @Test
    fun testCheckScore_levelNotComplete() {
        level5Logic.score = 5 // Assuming 10 is the winning score
        assertFalse(level5Logic.checkScore())
        assertFalse(level5Logic.gameEnded)
    }

    @Test
    fun testResetGame() {
        level5Logic.score = 5
        level5Logic.gameEnded = true
        level5Logic.resetGame()
        assertEquals(0, level5Logic.score)
        assertFalse(level5Logic.gameEnded)
    }

    
}*/