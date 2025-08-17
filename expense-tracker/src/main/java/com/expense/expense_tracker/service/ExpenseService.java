package com.expense.expense_tracker.service;
import com.expense.expense_tracker.model.Expense;
import com.expense.expense_tracker.repo.ExpenseRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public List<Expense> getAllExpenses() {
        return repository.findAll();
    }

    public Expense getExpense(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Expense saveExpense(Expense expense) {
        return repository.save(expense);
    }

    public void deleteExpense(Long id) {
        repository.deleteById(id);
    }

    public List<Expense> getMonthlyExpenses(LocalDate start, LocalDate end) {
        return repository.findByDateBetween(start, end);
    }
}
