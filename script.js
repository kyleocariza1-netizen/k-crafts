/* =====================================================
   K'S CRAFTS BUSINESS DASHBOARD
===================================================== */


/* =====================================================
   DATA
===================================================== */

let sales = JSON.parse(localStorage.getItem("ksCraftsSales")) || [];

let expenses = JSON.parse(localStorage.getItem("ksCraftsExpenses")) || [];

let customers = JSON.parse(localStorage.getItem("ksCraftsCustomers")) || [];


/* =====================================================
   WHEN PAGE LOADS
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    displaySales();

    displayExpenses();

    displayCustomers();

    updateCustomerSelect();

    updateDashboard();

    setupSalePreview();

    setupForms();

});


/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "ksCraftsSales",
        JSON.stringify(sales)
    );

    localStorage.setItem(
        "ksCraftsExpenses",
        JSON.stringify(expenses)
    );

    localStorage.setItem(
        "ksCraftsCustomers",
        JSON.stringify(customers)
    );

}


/* =====================================================
   MONEY FORMAT
===================================================== */

function formatMoney(amount) {

    return new Intl.NumberFormat("en-PH", {

        style: "currency",

        currency: "PHP",

        minimumFractionDigits: 2

    }).format(Number(amount) || 0);

}


/* =====================================================
   DATE
===================================================== */

function getToday() {

    const date = new Date();

    return date.toLocaleDateString("en-PH", {

        year: "numeric",

        month: "short",

        day: "numeric"

    });

}


/* =====================================================
   SALE MODAL
===================================================== */

function openSaleModal() {

    const modal = document.getElementById("saleModal");

    if (!modal) return;

    updateCustomerSelect();

    modal.classList.add("show");

}


function closeSaleModal() {

    const modal = document.getElementById("saleModal");

    if (!modal) return;

    modal.classList.remove("show");

}


/* =====================================================
   EXPENSE MODAL
===================================================== */

function openExpenseModal() {

    const modal = document.getElementById("expenseModal");

    if (!modal) return;

    modal.classList.add("show");

}


function closeExpenseModal() {

    const modal = document.getElementById("expenseModal");

    if (!modal) return;

    modal.classList.remove("show");

}


/* =====================================================
   CUSTOMER MODAL
===================================================== */

function openCustomerModal() {

    const modal = document.getElementById("customerModal");

    if (!modal) return;

    modal.classList.add("show");

}


function closeCustomerModal() {

    const modal = document.getElementById("customerModal");

    if (!modal) return;

}


/* =====================================================
   FORM SETUP
===================================================== */

function setupForms() {

    const saleForm = document.getElementById("saleForm");

    const expenseForm = document.getElementById("expenseForm");

    const customerForm = document.getElementById("customerForm");


    /* =========================
       SALE FORM
    ========================= */

    if (saleForm) {

        saleForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const customer =
                document.getElementById("saleCustomer").value.trim();

            const item =
                document.getElementById("saleItem").value.trim();

            const price =
                Number(document.getElementById("salePrice").value);

            const quantity =
                Number(document.getElementById("saleQuantity").value);


            if (!customer) {

                alert("Please select a customer.");

                return;

            }


            if (!item) {

                alert("Please enter the item/product.");

                return;

            }


            if (price <= 0) {

                alert("Please enter a valid price.");

                return;

            }


            if (quantity <= 0) {

                alert("Please enter a valid quantity.");

                return;

            }


            const total = price * quantity;


            const newSale = {

                id: Date.now(),

                date: getToday(),

                customer: customer,

                item: item,

                price: price,

                quantity: quantity,

                total: total

            };


            sales.push(newSale);


            saveData();

            displaySales();

            displayCustomers();

            updateDashboard();


            saleForm.reset();


            document.getElementById("saleQuantity").value = 1;

            document.getElementById("saleTotalPreview").textContent =
                formatMoney(0);


            closeSaleModal();


            alert("Sale recorded successfully!");

        });

    }


    /* =========================
       EXPENSE FORM
    ========================= */

    if (expenseForm) {

        expenseForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const name =
                document.getElementById("expenseName").value.trim();

            const description =
                document.getElementById("expenseDescription").value.trim();

            const amount =
                Number(document.getElementById("expenseAmount").value);


            if (!name) {

                alert("Please enter the expense name.");

                return;

            }


            if (amount <= 0) {

                alert("Please enter a valid amount.");

                return;

            }


            const newExpense = {

                id: Date.now(),

                date: getToday(),

                name: name,

                description: description,

                amount: amount

            };


            expenses.push(newExpense);


            saveData();

            displayExpenses();

            updateDashboard();


            expenseForm.reset();


            closeExpenseModal();


            alert("Expense saved successfully!");

        });

    }


    /* =========================
       CUSTOMER FORM
    ========================= */

    if (customerForm) {

        customerForm.addEventListener("submit", function (event) {

            event.preventDefault();


            const name =
                document.getElementById("customerName").value.trim();

            const contact =
                document.getElementById("customerContact").value.trim();


            if (!name) {

                alert("Please enter the customer name.");

                return;

            }


            if (!contact) {

                alert("Please enter the contact number.");

                return;

            }


            const duplicate = customers.some(function (customer) {

                return customer.name.toLowerCase() === name.toLowerCase();

            });


            if (duplicate) {

                alert("This customer already exists.");

                return;

            }


            const newCustomer = {

                id: Date.now(),

                name: name,

                contact: contact

            };


            customers.push(newCustomer);


            saveData();

            displayCustomers();

            updateCustomerSelect();

            updateDashboard();


            customerForm.reset();


            closeCustomerModal();


            alert("Customer added successfully!");

        });

    }

}


/* =====================================================
   SALE TOTAL PREVIEW
===================================================== */

function setupSalePreview() {

    const priceInput = document.getElementById("salePrice");

    const quantityInput = document.getElementById("saleQuantity");

    if (!priceInput || !quantityInput) return;


    function calculatePreview() {

        const price = Number(priceInput.value) || 0;

        const quantity = Number(quantityInput.value) || 0;

        const total = price * quantity;


        const preview =
            document.getElementById("saleTotalPreview");


        if (preview) {

            preview.textContent = formatMoney(total);

        }

    }


    priceInput.addEventListener(
        "input",
        calculatePreview
    );


    quantityInput.addEventListener(
        "input",
        calculatePreview
    );

}


/* =====================================================
   DISPLAY SALES
===================================================== */

function displaySales() {

    const salesList =
        document.getElementById("salesList");


    if (!salesList) return;


    salesList.innerHTML = "";


    if (sales.length === 0) {

        salesList.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-row"
                >
                    No sales recorded yet.
                </td>

            </tr>

        `;

        return;

    }


    sales.forEach(function (sale) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(sale.date)}</td>

            <td>${escapeHTML(sale.customer)}</td>

            <td>${escapeHTML(sale.item)}</td>

            <td>${sale.quantity}</td>

            <td>${formatMoney(sale.price)}</td>

            <td><strong>${formatMoney(sale.total)}</strong></td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteSale(${sale.id})"
                >
                    Delete
                </button>

            </td>

        `;


        salesList.appendChild(row);

    });

}


/* =====================================================
   DELETE SALE
===================================================== */

function deleteSale(id) {

    const confirmDelete =
        confirm("Delete this sale?");


    if (!confirmDelete) return;


    sales = sales.filter(function (sale) {

        return sale.id !== id;

    });


    saveData();

    displaySales();

    displayCustomers();

    updateDashboard();

}


/* =====================================================
   DISPLAY EXPENSES
===================================================== */

function displayExpenses() {

    const expenseList =
        document.getElementById("expenseList");


    if (!expenseList) return;


    expenseList.innerHTML = "";


    if (expenses.length === 0) {

        expenseList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="empty-row"
                >
                    No expenses recorded yet.
                </td>

            </tr>

        `;

        return;

    }


    expenses.forEach(function (expense) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(expense.date)}</td>

            <td>${escapeHTML(expense.name)}</td>

            <td>${escapeHTML(expense.description || "-")}</td>

            <td>
                <strong>
                    ${formatMoney(expense.amount)}
                </strong>
            </td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteExpense(${expense.id})"
                >
                    Delete
                </button>

            </td>

        `;


        expenseList.appendChild(row);

    });

}


/* =====================================================
   DELETE EXPENSE
===================================================== */

function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");


    if (!confirmDelete) return;


    expenses = expenses.filter(function (expense) {

        return expense.id !== id;

    });


    saveData();

    displayExpenses();

    updateDashboard();

}


/* =====================================================
   DISPLAY CUSTOMERS
===================================================== */

function displayCustomers() {

    const customerList =
        document.getElementById("customerList");


    if (!customerList) return;


    customerList.innerHTML = "";


    if (customers.length === 0) {

        customerList.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    class="empty-row"
                >
                    No customers added yet.
                </td>

            </tr>

        `;

        return;

    }


    customers.forEach(function (customer) {


        const orderCount =
            sales.filter(function (sale) {

                return sale.customer.toLowerCase() ===
                    customer.name.toLowerCase();

            }).length;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(customer.name)}
                </strong>
            </td>

            <td>
                ${escapeHTML(customer.contact)}
            </td>

            <td>
                ${orderCount}
            </td>

            <td>

                <button
                    class="delete-btn"
                    type="button"
                    onclick="deleteCustomer(${customer.id})"
                >
                    Delete
                </button>

            </td>

        `;


        customerList.appendChild(row);

    });

}


/* =====================================================
   DELETE CUSTOMER
===================================================== */

function deleteCustomer(id) {

    const customer =
        customers.find(function (item) {

            return item.id === id;

        });


    if (!customer) return;


    const hasOrders =
        sales.some(function (sale) {

            return sale.customer.toLowerCase() ===
                customer.name.toLowerCase();

        });


    if (hasOrders) {

        alert(
            "This customer has sales records. Delete the sales first."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Delete customer " +
            customer.name +
            "?"
        );


    if (!confirmDelete) return;


    customers = customers.filter(function (item) {

        return item.id !== id;

    });


    saveData();

    displayCustomers();

    updateCustomerSelect();

    updateDashboard();

}


/* =====================================================
   CUSTOMER DROPDOWN
===================================================== */

function updateCustomerSelect() {

    const select =
        document.getElementById("saleCustomer");


    if (!select) return;


    select.innerHTML = `

        <option value="">
            Select Customer
        </option>

    `;


    customers.forEach(function (customer) {

        const option =
            document.createElement("option");


        option.value = customer.name;

        option.textContent =
            customer.name +
            " - " +
            customer.contact;


        select.appendChild(option);

    });

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    let totalSales = 0;

    let totalExpenses = 0;


    sales.forEach(function (sale) {

        totalSales += Number(sale.total) || 0;

    });


    expenses.forEach(function (expense) {

        totalExpenses += Number(expense.amount) || 0;

    });


    const profit =
        totalSales - totalExpenses;


    const salesElement =
        document.getElementById("totalSales");


    const expenseElement =
        document.getElementById("totalExpenses");


    const profitElement =
        document.getElementById("totalProfit");


    const customerElement =
        document.getElementById("totalCustomers");


    if (salesElement) {

        salesElement.textContent =
            formatMoney(totalSales);

    }


    if (expenseElement) {

        expenseElement.textContent =
            formatMoney(totalExpenses);

    }


    if (profitElement) {

        profitElement.textContent =
            formatMoney(profit);

    }


    if (customerElement) {

        customerElement.textContent =
            customers.length;

    }

}


/* =====================================================
   ESCAPE HTML
   Prevents HTML from being inserted into tables
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener("click", function (event) {

    const saleModal =
        document.getElementById("saleModal");

    const expenseModal =
        document.getElementById("expenseModal");

    const customerModal =
        document.getElementById("customerModal");


    if (event.target === saleModal) {

        closeSaleModal();

    }


    if (event.target === expenseModal) {

        closeExpenseModal();

    }


    if (event.target === customerModal) {

        closeCustomerModal();

    }

});


/* =====================================================
   MAKE BUTTON FUNCTIONS AVAILABLE TO HTML
===================================================== */

window.openSaleModal = openSaleModal;

window.closeSaleModal = closeSaleModal;

window.openExpenseModal = openExpenseModal;

window.closeExpenseModal = closeExpenseModal;

window.openCustomerModal = openCustomerModal;

window.closeCustomerModal = closeCustomerModal;

window.deleteSale = deleteSale;

window.deleteExpense = deleteExpense;

window.deleteCustomer = deleteCustomer;