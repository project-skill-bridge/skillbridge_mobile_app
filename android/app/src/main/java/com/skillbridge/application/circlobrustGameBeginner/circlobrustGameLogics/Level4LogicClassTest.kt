/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustGameLogics

import org.junit.Assert.*
import org.junit.Before
import org.junit.Test

class Level4LogicClassTest {

    private lateinit var level4Logic: Level4LogicClass

    @Before
    fun setUp() {
        level4Logic = Level4LogicClass()
    }

    @Test
    fun testInitialState() {
        assertEquals(0, level4Logic.score)
        assertFalse(level4Logic.gameEnded)
        // Add more initial state assertions as needed
    }

    @Test
    fun testIncrementScore() {
        level4Logic.incrementScore()
        assertEquals(1, level4Logic.score)
    }

    @Test
    fun testCheckScore_levelComplete() {
        level4Logic.score = 10 // Assuming 10 is the winning score
        assertTrue(level4Logic.checkScore())
        assertTrue(level4Logic.gameEnded)
    }

    @Test
    fun testCheckScore_levelNotComplete() {
        level4Logic.score = 5 // Assuming 10 is the winning score
        assertFalse(level4Logic.checkScore())
        assertFalse(level4Logic.gameEnded)
    }

    @Test
    fun testResetGame() {
        level4Logic.score = 5
        level4Logic.gameEnded = true
        level4Logic.resetGame()
        assertEquals(0, level4Logic.score)
        assertFalse(level4Logic.gameEnded)
    }

    
}*/