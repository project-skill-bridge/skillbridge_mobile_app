/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustLostActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level3LostActivityClassTest {

    private lateinit var scenario: ActivityScenario<Level3LostActivityClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level3LostActivityClass::class.java)
        scenario = ActivityScenario.launch<Level3LostActivityClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
           
            // assert(activity.binding.levelLostTextView.text == "Level 3 Failed")
        }
    }

    @Test
    fun testTryAgainButton_launchesLevel3Activity() {
        scenario.onActivity { activity ->
            
            activity.tryAgain(activity.binding.tryAgainButton)
            assert(activity.isFinishing)
           
        }
    }

    @Test
    fun testHomeButton_launchesMainActivity() {
        scenario.onActivity { activity ->
            activity.goToHome(activity.binding.homeButton)
            assert(activity.isFinishing)
           
        }
    }
}*/