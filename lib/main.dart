import 'package:flutter/material.dart';
import 'package:skill_bridge/core/configs/theme/app_theme.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Skill Bridge',
      theme: AppTheme.lightTheme,
      home: Container(),
    );
  }
}
