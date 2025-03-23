/*package com.skillbridge.app.circlobrustGameBeginner.circlobrustLostActivities

import android.content.Intent
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import org.junit.After
import org.junit.Before
import org.junit.Test

class Level5LostActivityClassTest {

    private lateinit var scenario: ActivityScenario<Level5LostActivityClass>

    @Before
    fun setUp() {
        val intent = Intent(ApplicationProvider.getApplicationContext(), Level5LostActivityClass::class.java)
        scenario = ActivityScenario.launch<Level5LostActivityClass>(intent)
    }

    @After
    fun tearDown() {
        scenario.close()
    }

    @Test
    fun testOnCreate_initialState() {
        scenario.onActivity { activity ->
            
            // assert(activity.binding.levelLostTextView.text == "Level 5 Failed")
        }
    }

    @Test
    fun testTryAgainButton_launchesLevel5Activity() {
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