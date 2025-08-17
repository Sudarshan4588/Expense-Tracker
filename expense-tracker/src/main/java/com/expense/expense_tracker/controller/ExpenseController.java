package com.expense.expense_tracker.controller;
import com.expense.expense_tracker.model.Expense;
import com.expense.expense_tracker.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    @Autowired
    public ExpenseService service;

    @GetMapping()
    public List<Expense> getAllExpenses() {
        return service.getAllExpenses();
    }

    @GetMapping("/{id}")
    public Expense getExpense(@PathVariable Long id) {
        return service.getExpense(id);
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return service.saveExpense(expense);
    }

    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
        expense.setId(id);
        return service.saveExpense(expense);
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        service.deleteExpense(id);
    }
}