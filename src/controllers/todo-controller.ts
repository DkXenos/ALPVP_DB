import { NextFunction } from "express"
import { Response } from "express"
import { UserRequest } from "../models/user-request-model"
import { TodoService } from "../services/todo-service"
import { TodoCreateUpdateRequest } from "../models/todo-model"

export class TodoController {
    static async getAllTodos(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const response = await TodoService.getAllTodos(req.user!)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
    
    static async getTodo(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const todoListId = Number(req.params.todoListId)

            const response = await TodoService.getTodo(req.user!, todoListId)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async createTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const reqData = req.body as TodoCreateUpdateRequest

            const response = await TodoService.createTodo(req.user!, reqData)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async updateTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const reqData = req.body as TodoCreateUpdateRequest
            const todoListId = Number(req.params.todoListId)

            const response = await TodoService.updateTodo(
                req.user!,
                reqData,
                todoListId
            )

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }

    static async deleteTodo(
        req: UserRequest,
        res: Response,
        next: NextFunction
    ) {
        try {
            const todoListId = Number(req.params.todoListId)

            const response = await TodoService.deleteTodo(req.user!, todoListId)

            res.status(200).json({
                data: response,
            })
        } catch (error) {
            next(error)
        }
    }
}


