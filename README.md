# Database Schema

Run the following SQL queries in your database to set up the tables:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT UNSIGNED NOT NULL,
  score INT NOT NULL DEFAULT 0,
  mode VARCHAR(16) NOT NULL DEFAULT 'datatypes',
  difficulty VARCHAR(16) NOT NULL DEFAULT 'easy',
  level INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  KEY idx_mode (mode),
  KEY idx_score (score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```



# API Endpoints

## Authentication
- `auth/register.php` - Create a new account (username, password, password2)
- `auth/login.php` - Login with username and password
- `auth/logout.php` - Logout user
- `auth/me.php` - Get current user info

## Game API
- `api/leaderboard.php` - Get leaderboard scores (supports ?mode=datatypes, ?mode=vb, or all)
- `api/submit_score.php` - Submit a game score (mode, difficulty, level, score)

# Features

## Game Modes
- **Data Types** - Match data type cards (int, str, bool, float, list, dict)
- **Visual Basic** - Match VB keyword cards (Integer, String, Boolean, Single, Array, Variant)

## Difficulty Levels
- **Easy** - 45 seconds, 3x score multiplier
- **Medium** - 30 seconds, 5x score multiplier
- **Hard** - 20 seconds, 8x score multiplier

## Score Calculation
Score is calculated as: `100 * level * difficulty_multiplier`

## Themes
- **Dark** - Default dark theme
- **Light** - Light theme
- **Pink** - Pink theme

Nag sesave yung theme colors sa ibang page.

# PS

- `"includes/config.php"` - Andito ang mga dapat ayusin