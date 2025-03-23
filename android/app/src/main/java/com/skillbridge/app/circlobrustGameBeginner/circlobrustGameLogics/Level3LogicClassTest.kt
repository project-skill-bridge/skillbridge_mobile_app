/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class Level3LogicClassTest {

    private lateinit var level3Logic: Level3LogicClass

    @Before
    fun setUp() {
        level3Logic = Level3LogicClass()
    }

    @Test
    fun testInitialState() {
        assertEquals(0, level3Logic.score)
        assertFalse(level3Logic.gameEnded)
        // Add more initial state assertions as needed
    }

    @Test
    fun testIncrementScore() {
        level3Logic.incrementScore()
        assertEquals(1, level3Logic.score)
    }

    @Test
    fun testCheckScore_levelComplete() {
        level3Logic.score = 10 // Assuming 10 is the winning score
        assertTrue(level3Logic.checkScore())
        assertTrue(level3Logic.gameEnded)
    }

    @Test
    fun testCheckScore_levelNotComplete() {
        level3Logic.score = 5 // Assuming 10 is the winning score
        assertFalse(level3Logic.checkScore())
        assertFalse(level3Logic.gameEnded)
    }

    @Test
    fun testResetGame() {
        level3Logic.score = 5
        level3Logic.gameEnded = true
        level3Logic.resetGame()
        assertEquals(0, level3Logic.score)
        assertFalse(level3Logic.gameEnded)
    }

    
}*/