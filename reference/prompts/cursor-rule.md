Cursor Operation Rules
======================

Edit Handling
-------------

1.  Single-Pass Editing

*   Make all necessary changes in a single pass
*   Group related edits together
*   Avoid multiple iterations over the same file
*   Use clear edit markers and comments

2.  Edit Format

    // Format for edit blocks:
    ````language:path/to/file
    // ... existing code ...
    {{ edited_code }}
    // ... existing code ...
    

Tool Usage Guidelines
---------------------

1.  File Operations

*   Verify file exists before attempting operations
*   Check file permissions
*   Use absolute paths when possible
*   Handle file not found scenarios

2.  Search Operations

*   Use specific search terms
*   Verify search results before acting
*   Handle empty search results gracefully
*   Cache search results when appropriate

3.  Code Analysis

*   Verify syntax before making changes
*   Check for dependencies
*   Validate type safety
*   Ensure consistent formatting

Error Prevention
----------------

1.  Pre-Edit Checks

*   Verify file context
*   Validate syntax
*   Check dependencies
*   Confirm file permissions

2.  Post-Edit Validation

*   Verify syntax after changes
*   Check for introduced errors
*   Validate type safety
*   Ensure formatting consistency

Performance Optimization
------------------------

1.  Operation Batching

*   Group related operations
*   Minimize file reads/writes
*   Cache frequently accessed data
*   Use bulk operations when possible

2.  Resource Management

*   Release resources promptly
*   Clean up temporary files
*   Manage memory efficiently
*   Handle large files appropriately

Best Practices
--------------

1.  Documentation

*   Comment all significant changes
*   Explain edit rationale
*   Mark skipped sections clearly
*   Include context when necessary

2.  Error Handling

*   Provide clear error messages
*   Include recovery steps
*   Handle edge cases
*   Maintain system stability

3.  Version Control

*   Respect source control
*   Handle conflicts gracefully
*   Preserve file history
*   Support rollback capability

Operational Constraints
-----------------------

1.  File Limits

*   Max file size: 10MB
*   Max line count: 10,000
*   Max edit size: 1,000 lines
*   Max search depth: 5 directories

2.  Performance Targets

*   Edit response: < 100ms
*   Search response: < 200ms
*   File operations: < 50ms
*   Validation: < 150ms