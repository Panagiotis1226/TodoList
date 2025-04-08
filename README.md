# Design Patterns Demo - Todo Application

This project is a Todo application that demonstrates various design patterns. It shows how design patterns can be used to create a maintainable, scalable, and robust application.

## Design Patterns Implemented

### Creational Patterns

- **Factory Pattern** (`TodoFactory.ts`): Creates different types of Todo items with different properties, allowing for centralized object creation.
- **Singleton Pattern** (`TodoStore.ts`): Ensures only one instance of the TodoStore exists throughout the application.

### Structural Patterns

- **Adapter Pattern** (`TodoAdapter.ts`): Converts between the application's internal Todo format and external Todo formats.
- **Decorator Pattern** (`TodoDecorator.ts`): Dynamically adds additional functionality to Todo items, like due dates and tags.
- **Facade Pattern** (`TodoService.ts`): Provides a simplified interface to the complex subsystems of the application.

### Behavioral Patterns

- **Observer Pattern** (`TodoObserver.ts`): Defines a subscription mechanism to notify subscribers about changes to Todo items.
- **Strategy Pattern** (`TodoStrategy.ts`): Defines a family of algorithms for filtering Todo items and makes them interchangeable.
- **Command Pattern** (`TodoCommand.ts`): Encapsulates Todo operations as objects, enabling undo/redo functionality.

## How to Run

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the application with `npm start`
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Project Structure

- `src/patterns/creational`: Contains creational design patterns
- `src/patterns/structural`: Contains structural design patterns
- `src/patterns/behavioral`: Contains behavioral design patterns
- `src/models`: Contains data models
- `src/components`: Contains React components
- `src/services`: Contains service classes that use the design patterns

## Features

- Create, read, update, and delete Todo items
- Filter Todo items by status, priority
- Add tags to Todo items
- Set due dates for Todo items
- Undo/Redo operations

## Design Pattern Interactions

This application demonstrates how design patterns can work together to create a well-structured application:

1. The **Factory Pattern** creates Todo objects
2. The **Singleton Pattern** ensures a single instance of the Todo store
3. The **Decorator Pattern** adds additional functionality to Todo items
4. The **Observer Pattern** notifies components when Todos change
5. The **Command Pattern** enables undo/redo functionality
6. The **Strategy Pattern** provides different filtering strategies
7. The **Adapter Pattern** allows for data conversion
8. The **Facade Pattern** (TodoService) simplifies the complex subsystems

## Testing

Run tests with `npm test`

## Contributions

This project is designed for educational purposes to demonstrate design patterns in a real-world application.
