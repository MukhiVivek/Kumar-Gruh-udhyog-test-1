let purchaseData = [];  // Array to store fetched data
let todayPurchaseTotal = 0;  // Variable to store today's total expense
let weekPurchaseTotal = 0;  // Variable to store weekly total expense
let monthPurchaseTotal = 0;  // Variable to store monthly total expense

// Function to fetch purchase data from the server
async function fetchPurchaseData() {
    try {
        const response = await fetch('https://kumar-gruh-udhyog-test-1.onrender.com/parties/api/purchases');  // Adjust URL as needed
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse and store the data
        purchaseData = await response.json();
        
        // Calculate and display today's total purchase expense
        calculateTodayExpense(purchaseData);
        
        // Calculate and display weekly purchase expense
        calculateWeekExpense(purchaseData);
        
        // Calculate and display monthly purchase expense
        calculateMonthExpense(purchaseData);
        
        // Update HTML elements with the totals
        updateTotalOnPurchasePage(todayPurchaseTotal, 'today_purchase', 'today_purchase1');
        updateTotalOnPurchasePage(weekPurchaseTotal, 'week_purchase', 'week_purchase1');
        updateTotalOnPurchasePage(monthPurchaseTotal, 'month_purchase', 'month_purchase1');
    } catch (error) {
        console.error('Error fetching purchase data:', error.message);
    }
}

// Function to calculate today's total expense
function calculateTodayExpense(purchaseData) { 
    const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format
    todayPurchaseTotal = 0;  // Reset total before calculation
    
    purchaseData.forEach(purchase => {
        if (!purchase.date) return;  // Skip items without a date
        
        const purchaseDate = new Date(purchase.date).toISOString().split('T')[0];
        
        if (purchaseDate === today) {
            const { box, box_weight, rate } = purchase;
            todayPurchaseTotal += box * box_weight * rate;  // Calculate total for each item
        }      
    });
}

// Function to calculate weekly total expense (Monday to Sunday)
function calculateWeekExpense(purchaseData) {
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() - 6);  // Last week's Monday
    lastMonday.setHours(0, 0, 0, 0);  // Set to the start of the day

    const lastSunday = new Date(today);
    lastSunday.setDate(lastMonday.getDate() + 6);  // Last week's Sunday
    lastSunday.setHours(23, 59, 59, 999);  // Set to the end of the day

    weekPurchaseTotal = 0;  // Reset total before calculation

    purchaseData.forEach(purchase => {
        if (!purchase.date) return;  // Skip items without a date

        const purchaseDate = new Date(purchase.date);
        if (purchaseDate >= lastMonday && purchaseDate <= lastSunday) {
            const { box, box_weight, rate } = purchase;
            weekPurchaseTotal += box * box_weight * rate;  // Calculate total for each item
        }
    });
}

// Function to calculate monthly total expense (1st to last date of the month)
function calculateMonthExpense(purchaseData) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);  // 1st of the current month
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);  // Last day of the current month

    monthPurchaseTotal = 0;  // Reset total before calculation

    purchaseData.forEach(purchase => {
        if (!purchase.date) return;  // Skip items without a date

        const purchaseDate = new Date(purchase.date);
        if (purchaseDate >= firstDayOfMonth && purchaseDate <= lastDayOfMonth) {
            const { box, box_weight, rate } = purchase;
            monthPurchaseTotal += box * box_weight * rate;  // Calculate total for each item
        }
    });
}

// Function to update the total expense on the webpage in Indian currency format
function updateTotalOnPurchasePage(total, elementId, elementId1) {
    const purchaseElement = document.getElementById(elementId);  // Get the HTML element
    const purchaseElement1 = document.getElementById(elementId1);  // Get the second HTML element
    
    if (purchaseElement) {
        const formattedTotal = new Intl.NumberFormat('en-IN').format(total);  // Format in Indian currency
        purchaseElement.textContent = `${formattedTotal} /-`;  // Update the content
        purchaseElement1.textContent = `${formattedTotal} /-`;  // Update the content
    }
}

// Call the fetch function to get and process data
fetchPurchaseData();


// today total sales 

// Function to fetch sales data from the server
async function fetchSalesData() {
    try {
        const response = await fetch('https://kumar-gruh-udhyog-test-1.onrender.com/invoice/api/inoice');  // Adjust URL as needed
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        salesData = await response.json();  // Store the fetched data
        const todaySales = getTodaySales(salesData);  // Filter today's sales
        const lastWeekSales = getLastWeekSales(salesData);  // Filter last week's sales
        const monthSales = getMonthSales(salesData);  // Filter current month's sales

        const totalTodaySales = calculateTotalSales(todaySales);  // Calculate total sales for today
        const totalLastWeekSales = calculateTotalSales(lastWeekSales);  // Calculate total sales for last week
        const totalMonthSales = calculateTotalSales(monthSales);  // Calculate total sales for the current month

        updateTotalOnPage(totalTodaySales, 'todaySales', 'todaySales1');  // Update today's total on the webpage
        updateTotalOnPage(totalLastWeekSales, 'lastWeekSales', 'lastWeekSales1');  // Update last week's total on the webpage
        updateTotalOnPage(totalMonthSales, 'monthSales', 'monthSales1');  // Update this month's total on the webpage
    } catch (error) {
        console.error('Error fetching sales data:', error.message);
    }
}

// Function to filter sales made today
function getTodaySales(salesData) {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format

    return salesData.filter(sale => {
        if (!sale.date) return false;  // Skip if there's no date
        
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === today;
    });
}

// Function to filter sales made last week (Monday to Sunday)
function getLastWeekSales(salesData) {
    const now = new Date();
    const dayOfWeek = now.getDay();  // Get current day of the week (0 = Sunday, 6 = Saturday)
    const lastMonday = new Date(now);
    lastMonday.setDate(now.getDate() - dayOfWeek - 6);  // Go back to the last Monday
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - dayOfWeek);  // Go back to the last Sunday

    return salesData.filter(sale => {
        if (!sale.date) return false;  // Skip if there's no date

        const saleDate = new Date(sale.date);
        return saleDate >= lastMonday && saleDate <= lastSunday;
    });
}

// Function to filter sales made in the current month
function getMonthSales(salesData) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);  // 1st of the current month
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);  // Last day of the current month

    return salesData.filter(sale => {
        if (!sale.date) return false;  // Skip if there's no date

        const saleDate = new Date(sale.date);
        return saleDate >= firstDayOfMonth && saleDate <= lastDayOfMonth;
    });
}

// Function to calculate total sales for a given period
function calculateTotalSales(sales) {
    return sales.reduce((total, sale) => {
        return total + sale.subtotal;  // Add each sale's subtotal to the total
    }, 0);  // Initial total is 0
}

// Function to update the total sales on the webpage in Indian currency format
function updateTotalOnPage(total, elementId, elementId1) {
    const salesElement = document.getElementById(elementId);  // Get the HTML element
    const salesElement1 = document.getElementById(elementId1);  // Get the second HTML element
    if (salesElement) {
        const formattedTotal = new Intl.NumberFormat('en-IN').format(total);  // Format total
        salesElement.textContent = `${formattedTotal} /-`;  // Update the content
        salesElement1.textContent = `${formattedTotal} /-`;  // Update the content
    }
}

// Call the fetch function to get and process data
fetchSalesData();


let paymentData = [];  // Array to store fetched sales data

// Function to fetch sales data from the server
async function fetchpaymentData() {
    try {
        const response = await fetch('https://kumar-gruh-udhyog-test-1.onrender.com/parties/api/payment');  // Adjust URL as needed
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        paymentData = await response.json();  // Store the fetched data

        // Filter today's payments
        const todaySales = getTodayPayments(paymentData);
        const totalTodaySales = calculateTotalPayments(todaySales);
        updateTotalOnPaymentPage(totalTodaySales, 'todayPaymnets', 'todayPaymnets1');

        // Filter last week's payments
        const lastWeekSales = getLastWeekPayments(paymentData);
        const totalLastWeekSales = calculateTotalPayments(lastWeekSales);
        updateTotalOnPaymentPage(totalLastWeekSales, 'lastWeekPayments', 'lastWeekPayments1');

        // Filter full month's payments
        const fullMonthSales = getFullMonthPayments(paymentData);
        const totalFullMonthSales = calculateTotalPayments(fullMonthSales);
        updateTotalOnPaymentPage(totalFullMonthSales, 'fullMonthPayments', 'fullMonthPayments1');
    } catch (error) {
        console.error('Error fetching sales data:', error.message);
    }
}

// Function to filter sales made today
function getTodayPayments(paymentData) {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in 'YYYY-MM-DD' format

    return paymentData.filter(payment => {
        if (!payment.date) return false;  // Skip if there's no date

        const paymentDate = new Date(payment.date).toISOString().split('T')[0];
        return paymentDate === today;
    });
}

// Function to filter last week's sales (Monday to Sunday)
function getLastWeekPayments(paymentData) {
    const today = new Date();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() - 6);  // Last week's Monday
    lastMonday.setHours(0, 0, 0, 0);  // Set to the start of the day

    const lastSunday = new Date(today);
    lastSunday.setDate(lastMonday.getDate() + 6);  // Last week's Sunday
    lastSunday.setHours(23, 59, 59, 999);  // Set to the end of the day

    return paymentData.filter(payment => {
        if (!payment.date) return false;  // Skip if there's no date

        const paymentDate = new Date(payment.date);
        return paymentDate >= lastMonday && paymentDate <= lastSunday;
    });
}

// Function to filter full month's sales
function getFullMonthPayments(paymentData) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);  // 1st day of the current month
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);  // Last day of the current month

    return paymentData.filter(payment => {
        if (!payment.date) return false;  // Skip if there's no date

        const paymentDate = new Date(payment.date);
        return paymentDate >= firstDayOfMonth && paymentDate <= lastDayOfMonth;
    });
}

// Function to calculate total payments
function calculateTotalPayments(filteredPayments) {
    return filteredPayments.reduce((total, payment) => {
        return total + payment.amount;  // Add each sale's subtotal to the total
    }, 0);  // Initial total is 0
}

// Function to update the total payments on the webpage in Indian currency format
function updateTotalOnPaymentPage(total, elementId, elementId1) {
    const totalElement = document.getElementById(elementId);  // Get the HTML element
    const totalElement1 = document.getElementById(elementId1);  // Get the HTML element
    if (totalElement) {
        const formattedTotal = new Intl.NumberFormat('en-IN').format(total);  // Format total
        totalElement.textContent = `${formattedTotal} /-`;  // Update the content
        totalElement1.textContent = `${formattedTotal} /-`;  // Update the content
    }
}

// Call the fetch function to get and process data
fetchpaymentData();
