/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustGameLogics

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class Level1LogicClassTest {

    private lateinit var level1Logic: Level1LogicClass

    @Before
    fun setUp() {
        level1Logic = Level1LogicClass()
    }

    @Test
    fun testInitialState() {
        assertEquals(0, level1Logic.score)
        assertFalse(level1Logic.gameEnded)
        // Add more initial state assertions as needed
    }

    @Test
    fun testIncrementScore() {
        level1Logic.incrementScore()
        assertEquals(1, level1Logic.score)
    }

    @Test
    fun testCheckScore_levelComplete() {
        level1Logic.score = 10 // Assuming 10 is the winning score
        assertTrue(level1Logic.checkScore())
        assertTrue(level1Logic.gameEnded)
    }

    @Test
    fun testCheckScore_levelNotComplete() {
        level1Logic.score = 5 // Assuming 10 is the winning score
        assertFalse(level1Logic.checkScore())
        assertFalse(level1Logic.gameEnded)
    }

    @Test
    fun testResetGame() {
        level1Logic.score = 5
        level1Logic.gameEnded = true
        level1Logic.resetGame()
        assertEquals(0, level1Logic.score)
        assertFalse(level1Logic.gameEnded)
    }

    
}*/