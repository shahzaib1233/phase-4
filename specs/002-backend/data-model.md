# Data Model: Secure & Production-Ready Backend for Phase II Todo Web App

## Task Entity

**Fields:**
- id: Integer (Primary Key, Auto-increment)
- title: String (Required, max 255 characters)
- description: String (Optional, max 1000 characters)
- completed: Boolean (Default: False)
- user_id: String (Required, Foreign Key to Better Auth user.id)
- created_at: DateTime (Auto-generated on creation)
- updated_at: DateTime (Auto-generated on update)

**Relationships:**
- One-to-Many: User (via user_id foreign key) to Many Tasks
- User relationship is managed by Better Auth system

**Validation Rules:**
- title must not be empty
- user_id must match the authenticated user from JWT token
- completed status can only be toggled by the task owner

**Indexes:**
- Index on user_id for efficient filtering by user
- Index on completed for efficient status-based queries
- Composite index on (user_id, completed) for combined filtering

## User Entity (External)

**Reference to Better Auth User:**
- user_id: String (Primary Key from Better Auth)
- Managed externally by Better Auth system
- Only user_id is stored in task records for ownership verification

## State Transitions

**Task Status:**
- Incomplete (completed=False) → Complete (completed=True) via PATCH /api/{user_id}/tasks/{id}/complete
- Complete (completed=True) → Incomplete (completed=False) via PATCH /api/{user_id}/tasks/{id}/complete

## Constraints

1. **Ownership Constraint**: All database queries must filter by user_id to prevent cross-user data access
2. **Immutability Constraint**: user_id cannot be changed after task creation
3. **Data Integrity**: created_at timestamp is immutable, updated_at updates on every modification