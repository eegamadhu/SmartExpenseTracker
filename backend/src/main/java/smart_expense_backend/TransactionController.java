package smart_expense_backend;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/transactions")
@CrossOrigin
public class TransactionController {

    private final TransactionRepository repository;

    public TransactionController(TransactionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return repository.findAll();
    }

    @PostMapping
    public Transaction addTransaction(@RequestBody Transaction transaction) {
        return repository.save(transaction);
    }

    @PutMapping("/{id}")
    public Transaction updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {

        Transaction existingTransaction =
                repository.findById(id).orElse(null);
       
        System.out.println("Date received from React: " + transaction.getDate());

        if (existingTransaction != null) {
            existingTransaction.setTitle(transaction.getTitle());
            existingTransaction.setAmount(transaction.getAmount());
            existingTransaction.setType(transaction.getType());
            existingTransaction.setCategory(transaction.getCategory());
            existingTransaction.setDate(transaction.getDate());

            return repository.save(existingTransaction);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteTransaction(@PathVariable Long id) {

        repository.deleteById(id);

        return "Transaction deleted successfully";
    }
}