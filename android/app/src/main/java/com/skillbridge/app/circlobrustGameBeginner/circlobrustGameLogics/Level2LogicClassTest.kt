/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustGameLogics

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class Level2LogicClassTest {

    private lateinit var level2Logic: Level2LogicClass

    @Before
    fun setUp() {
        level2Logic = Level2LogicClass()
    }

    @Test
    fun testInitialState() {
        assertEquals(0, level2Logic.score)
        assertFalse(level2Logic.gameEnded)
      
    }

    @Test
    fun testIncrementScore() {
        level2Logic.incrementScore()
        assertEquals(1, level2Logic.score)
    }

    @Test
    fun testCheckScore_levelComplete() {
        level2Logic.score = 10 // Assuming 10 is the winning score
        assertTrue(level2Logic.checkScore())
        assertTrue(level2Logic.gameEnded)
    }

    @Test
    fun testCheckScore_levelNotComplete() {
        level2Logic.score = 5 // Assuming 10 is the winning score
        assertFalse(level2Logic.checkScore())
        assertFalse(level2Logic.gameEnded)
    }

    @Test
    fun testResetGame() {
        level2Logic.score = 5
        level2Logic.gameEnded = true
        level2Logic.resetGame()
        assertEquals(0, level2Logic.score)
        assertFalse(level2Logic.gameEnded)
    }

   
}*/