package com.skillbridge.application.circlobrustGameBeginner.circlobrustPanelScreens

// Imports for Android permissions handling, context access, navigation, and UI components
import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.Navigation
import com.skillbridge.application.R

/* ================ Constants Section ================ 
 * Required permissions list for camera access
 * Used for permission checking and requesting
 */
private val PERMISSIONS_REQUIRED = arrayOf(Manifest.permission.CAMERA)

/* ================ Fragment Definition Section ================ 
 * Permission management fragment for handling camera access
 * Checks for existing permissions and requests them if needed
 * Automatically navigates to camera screen once permissions are granted
 */
class PermissionsPanel : Fragment() {

    /* ================ Permission Management Section ================ 
     * Handler for permission request results
     * Processes user's permission decisions and navigates accordingly
     */
    private val requestPermissionLauncher =
        registerForActivityResult(
            ActivityResultContracts.RequestPermission()
        ) { isGranted: Boolean ->
            if (isGranted) {
                Toast.makeText(
                    context,
                    "Permission request granted",
                    Toast.LENGTH_LONG
                ).show()
                navigateToCamera()
            } else {
                Toast.makeText(
                    context,
                    "Permission request denied",
                    Toast.LENGTH_LONG
                ).show()
            }
        }

    /* ================ Lifecycle Section ================ 
     * Fragment lifecycle methods for initialization
     * Handles permission checking on creation
     */
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        when (PackageManager.PERMISSION_GRANTED) {
            ContextCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.CAMERA
            ) -> {
                navigateToCamera()
            }
            else -> {
                requestPermissionLauncher.launch(
                    Manifest.permission.CAMERA
                )
            }
        }
    }

    /* ================ Navigation Section ================ 
     * Methods for navigating between screens
     * Handles transition to camera screen after permissions are granted
     */
    private fun navigateToCamera() {
        lifecycleScope.launchWhenStarted {
            Navigation.findNavController(
                requireActivity(),
                R.id.fragment_container
            ).navigate(
                R.id.action_permissions_to_camera
            )
        }
    }

    /* ================ Utility Section ================ 
     * Static helper methods for permission management
     * Provides convenience functions for permission checking
     */
    companion object {

        /** Convenience method used to check if all permissions required by this app are granted */
        fun hasPermissions(context: Context) = PERMISSIONS_REQUIRED.all {
            ContextCompat.checkSelfPermission(
                context,
                it
            ) == PackageManager.PERMISSION_GRANTED
        }
    }
}
