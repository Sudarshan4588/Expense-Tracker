package com.expense.expense_tracker.controller;

import com.expense.expense_tracker.model.Expense;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
public class LoginController {
    @GetMapping("/")
    public String login(){
        return "index";
    }
}
