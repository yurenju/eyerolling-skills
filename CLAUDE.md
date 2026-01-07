# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a specification-driven development workflow command set designed for Claude Code and other AI assistants. The project provides a structured three-step methodology: from requirement clarification to complete implementation, ensuring the development process is clear and traceable through PRD (Product Requirements Document) driven development.

The core value lies in ensuring every feature goes through thorough requirement analysis, has clear implementation plans, and maintains a trackable, interruptible, and resumable execution process.

## Core Architecture

The project follows a three-step specification-driven workflow:

### Step 1: Requirement Clarification (`/create-prd`)
- Interactive Q&A to clarify feature requirements
- Generate comprehensive Product Requirements Document (PRD)
- Output: `docs/specs/[date]-[feature-name]/prd.md`
- Target audience: Product managers and business people
- Focus: Business value, user needs, high-level technical direction

### Step 2: Implementation Planning (`/create-impl-plan`)
- Analyze PRD and existing codebase architecture
- Generate 5-7 specific implementation tasks with detailed implementation points
- Generate "Completion Checks" for each task with executable verification methods
- Automatic Gherkin acceptance test generation
- Output: `implementation.md` + `acceptance.feature`
- Target audience: Developers (junior to intermediate)
- **Enhanced Feature**: Implementation reference information extraction from research and PRD files

### Step 3: Task Execution (`/process-task-list`)
- Execute implementation tasks one by one with automatic git commits
- Execute "Completion Checks" after each task to verify implementation
- Acceptance testing integration with specialized acceptance-tester agent
- Support for multi-session execution for long-term development
- Reference documents: implementation.md, PRD, acceptance.feature, research (if available)

### Workflow Context Awareness

Each command includes a "Workflow Context" section that provides:
- **Global View**: Understanding of the complete three-step workflow
- **Stage Position**: Current stage in the overall development process
- **Input/Output Clarity**: What information comes in and what should be produced
- **Responsibility Boundaries**: What should and should not be included in outputs
- **Stage Relationships**: How current stage connects with previous and next stages

This design ensures:
- **Separation of Concerns**: Each stage focuses on its specific responsibilities
- **Content Distribution**: Technical details flow from research → PRD (reference only) → implementation.md (detailed extraction)
- **Audience Alignment**: PRD for business stakeholders, implementation.md for developers
- **Context Preservation**: Technical insights preserved through "Implementation Reference" sections

### Supporting Components

#### Installation System (`/scripts/`)
- **install-config.js**: Automated installation to `~/.claude/commands`
- Cross-platform compatibility and conflict detection

#### Documentation Output (`/docs/`)
- **research/**: Research documents (optional auxiliary feature)
- **specs/**: Complete specification folders with PRD, implementation plans, and acceptance tests

## Common Commands

### Development Setup
```bash
# Install workflow commands to Claude Code
npm run install-config

# Force overwrite existing commands
npm run install-config -- overwrite
```

### Project Dependencies
- **shelljs**: For cross-platform shell operations in installation scripts
- **Node.js**: Required for installation scripts execution

## Key Workflow Patterns

### 1. Research-Driven Development
- Start with `/research` command for complex problems
- Output: `docs/research/[date]-[topic].md`
- Focus on problem understanding before solution design

### 2. PRD-First Feature Development
- Use `/create-prd` for new feature requirements
- Output: `docs/specs/[date]-[feature-name]/prd.md`
- Target audience: Product managers and business people
- Focus on business value and user needs, reference (not copy) technical details from research

### 3. Implementation Planning
- Use `/create-impl-plan` to convert PRD to actionable tasks
- Output: Implementation markdown + Gherkin acceptance tests
- Integrates with Claude Code's TodoWrite tool
- Each task includes "Completion Checks" for verification

### 4. Acceptance Testing Integration
- Automatic detection of acceptance testing tasks
- Launches specialized acceptance-tester agent with complete file context
- Executes Gherkin scenarios through commands and browser automation
- Receives implementation.md, acceptance.feature, and prd.md for comprehensive testing

## File Naming Conventions

- Research documents: `[YYYY-MM-DD]-[topic-slug].md`
- Spec folders: `[YYYY-MM-DD]-[feature-name]/`
- Spec contents: `prd.md`, `implementation.md`, `acceptance.feature`

## Installation Locations

- **Windows**: `C:\Users\[username]\.claude\commands` and `C:\Users\[username]\.claude\agents`
- **macOS/Linux**: `~/.claude/commands` and `~/.claude/agents`

## Language Support

All workflow commands automatically adapt to user's conversation language:
- Chinese conversations → Traditional Chinese documentation
- English conversations → English documentation
- Code, comments, and git commit messages always in English

## Integration Points

### Claude Code TodoWrite Tool
- Task synchronization between internal lists and markdown files
- Bi-directional task state management with persistent storage
- Git workflow integration with semantic commit messages
- Completion check execution after each task

### Testing Framework
- Gherkin format acceptance criteria with Traditional Chinese support
- Support for both terminal commands and browser automation
- AI-executable test scenarios with comprehensive file context
- Acceptance-tester agent integration for systematic validation

### Implementation Context Transfer Enhancement
- Automatic extraction of implementation-related technical information from research and PRD files
- Preservation of code examples, technical decisions, and verified solutions
- Three-tier reference structure: research insights → PRD details → key technical decisions
- Enhanced task execution with complete background context

## Development Best Practices

1. **Three-Step Sequential Workflow**: Follow requirement clarification → implementation planning → task execution
2. **Clarification First**: Thorough Q&A during PRD creation to ensure requirement clarity
3. **Specification-Driven**: Every feature must have clear PRD before implementation
4. **Separation of Concerns**: Each stage has distinct responsibilities and target audiences
   - PRD: Business focus for product managers and stakeholders
   - Implementation.md: Technical focus for developers with detailed guidance
   - Task execution: Practical implementation with complete context awareness
5. **Content Distribution**: Technical details flow correctly through stages
   - Research: Deep technical analysis and code examples
   - PRD: High-level technical direction (reference, not copy)
   - Implementation.md: Detailed technical extraction in "Implementation Reference" section
6. **Continuous Sync**: Keep task states updated in real-time with TodoWrite integration
7. **Version Control**: Automatic git commit after each completed task with semantic messages
8. **Completion Checks**: Execute verification methods after each task to ensure quality
9. **Comprehensive Testing**: Complete acceptance testing with full context awareness

## Technical Considerations

- Cross-platform installation script using shelljs
- File conflict detection prevents accidental overwrites
- Modular command structure allows independent updates
- Completion check integration with multiple verification methods (unit tests, MCP tools, commands)
- Acceptance-tester agent integration for comprehensive validation
- Implementation context preservation across research → PRD → implementation phases
- Support for both research-driven and direct PRD development approaches
- Relative path handling for cross-platform compatibility