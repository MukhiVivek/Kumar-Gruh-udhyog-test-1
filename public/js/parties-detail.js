const toggleSwitch = document.getElementById('flexSwitchCheckDefault');
    const paymentContainer = document.getElementById('paymentContainer');

    toggleSwitch.addEventListener('change', () => {
        if (toggleSwitch.checked) {
            paymentContainer.classList.remove('d-none');
            paymentContainer.classList.add('d-block');
        } else {
            paymentContainer.classList.remove('d-block');
            paymentContainer.classList.add('d-none');
        }
    });


    // Select the input elements
    const boxInput = document.getElementById('box');
    const boxWeightInput = document.getElementById('boxWeight');
    const rateInput = document.getElementById('rate');
    const amountInput = document.getElementById('amount');

    // Function to calculate and update the amount
    function calculateAmount() {
        const box = parseFloat(boxInput.value) || 0; // Parse input values or default to 0
        const boxWeight = parseFloat(boxWeightInput.value) || 0;
        const rate = parseFloat(rateInput.value) || 0;

        const amount = box * boxWeight * rate; // Calculate the amount
        amountInput.value = amount; // Update the Amount field with 2 decimal places
    }

    // Add event listeners to the inputs
    boxInput.addEventListener('input', calculateAmount);
    boxWeightInput.addEventListener('input', calculateAmount);
    rateInput.addEventListener('input', calculateAmount);


    
    