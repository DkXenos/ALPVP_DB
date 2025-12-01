import { Todo } from "../../generated/prisma"
import { ResponseError } from "../error/response-error"
import { TodoCreateUpdateRequest, TodoResponse, toTodoResponse, toTodoResponseList } from "../models/todo-model"
import { UserJWTPayload } from "../models/user-model"
import { prismaClient } from "../utils/database-util"
import { TodoValidation } from "../validations/todo-validation"
import { Validation } from "../validations/validation"

export class TodoService{
    static async getAllTodos(user: UserJWTPayload): Promise<TodoResponse[]> {
        const todos = await prismaClient.todo.findMany({
            where: {
                user_id: user.id,
            },
        })

        return toTodoResponseList(todos)
    }

    static async getTodo(
        user: UserJWTPayload,
        todoListId: number
    ): Promise<TodoResponse> {
        const todo = await this.checkTodoIsEmpty(user.id, todoListId)

        return toTodoResponse(todo)
    }

    static async checkTodoIsEmpty(
        userId: number,
        todoListId: number
    ): Promise<Todo> {
        const todo = await prismaClient.todo.findFirst({
            where: {
                user_id: userId,
                id: todoListId,
            },
        })

        if (!todo) {
            throw new ResponseError(400, "Todo not found!")
        }

        return todo
    }

    static async createTodo(
        user: UserJWTPayload,
        reqData: TodoCreateUpdateRequest
    ): Promise<string> {
        const validatedData = Validation.validate(
            TodoValidation.CREATE_UPDATE,
            reqData
        )

        await prismaClient.todo.create({
            data: {
                title: validatedData.title,
                description: validatedData.description,
                status: validatedData.status,
                priority: validatedData.priority,
                due_date: validatedData.due_date,
                user_id: user.id,
            },
        })

        return "Todo data has been created successfully!"
    }

    static async updateTodo(
        user: UserJWTPayload,
        req: TodoCreateUpdateRequest,
        todoListId: number
    ) {
        const validatedData = Validation.validate(
            TodoValidation.CREATE_UPDATE,
            req
        )

        await this.checkTodoIsEmpty(user.id, todoListId)

        await prismaClient.todo.update({
            where: {
                user_id: user.id,
                id: todoListId,
            },
            data: {
                title: validatedData.title,
                description: validatedData.description,
                status: validatedData.status,
                priority: validatedData.priority,
                due_date: validatedData.due_date,
                user_id: user.id,
            },
        })

        return "Todo data has been updated successfully!"
    }

    static async deleteTodo(user: UserJWTPayload, todoListId: number) {
        await this.checkTodoIsEmpty(user.id, todoListId)

        await prismaClient.todo.delete({
            where: {
                user_id: user.id,
                id: todoListId,
            },
        })

        return "Todo data has been deleted successfully!"
    }
}