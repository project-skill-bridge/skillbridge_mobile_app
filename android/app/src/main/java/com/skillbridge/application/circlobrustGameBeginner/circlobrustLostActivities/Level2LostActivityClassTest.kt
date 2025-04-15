/*package com.skillbridge.application.circlobrustGameBeginner.circlobrustLostActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level2LostActivityClassTest {

    private lateinit var scenario: ActivityScenario<Level2LostActivityClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level2LostActivityClass::class.java)
        scenario = ActivityScenario.launch<Level2LostActivityClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            
            // assert(activity.binding.levelLostTextView.text == "Level 2 Failed")
        }
    }

    @Test
    fun testTryAgainButton_launchesLevel2Activity() {
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