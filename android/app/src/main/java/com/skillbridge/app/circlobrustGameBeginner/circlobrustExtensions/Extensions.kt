package com.skillbridge.app.circlobrustGameBeginner.circlobrustExtensions

// Import for Kotlin's random number generation functionality
import kotlin.random.Random

/* ================ Utility Extensions Section ================ 
 * Extension functions for common operations across the game
 * Provides random number generation and value range calculations
 * Simplifies gameplay mechanics that require randomization
 */
fun ClosedRange<Float>.randomFloat(): Float {
    return Random.nextFloat() * (endInclusive - start) + start
}