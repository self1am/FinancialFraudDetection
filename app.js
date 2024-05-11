// Define constants for DOM elements
const fileInput = document.getElementById('fileInput');
const scanButton = document.getElementById('scanButton');
const resultSection = document.getElementById('resultSection');
const resultContainer = document.getElementById('resultContainer');

// Event listener for file input change
fileInput.addEventListener('change', handleFileUpload);

// Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        scanButton.disabled = false;
    } else {
        scanButton.disabled = true;
    }
}

// Event listener for scan button click
scanButton.addEventListener('click', scanForFraud);

// Function to scan for fraud
function scanForFraud() {
    const file = fileInput.files[0];
    if (file) {
        // Read the file and process the financial data
        readFileAndProcessData(file);
    }
}

// Function to read file and process data
function readFileAndProcessData(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const data = event.target.result;
        console.log("Data from file:", data); // Log the data from the file
        displayUploadedFile(data);
        try {
            // Parse the data (assuming CSV format)
            const parsedData = parseCSVData(data);
            console.log("Parsed data:", parsedData); // Log the parsed data
            // Prepare input for the neural network
            const input = prepareInput(parsedData);
            console.log("Input for neural network:", input); // Log the input for the neural network
            // Use the trained neural network to predict fraudulence for each input
            const fraudulenceResults = parsedData.map(input => {
                // Use the trained neural network to predict fraudulence for the current input
                const fraudulence = neuralNetwork.feedForward(input).finalOutputs;
                return fraudulence[0]; // Assuming only one output node
            });

            // Display the results
            displayResults(fraudulenceResults);

        } catch (error) {
            console.error("Error processing data:", error);
            // Display error message
            displayError("Error processing data. Please check the file format.");
        }
    };
    reader.readAsText(file);
}

// Function to display the uploaded CSV file as a table
function displayUploadedFile(data) {
    const fileContentElement = document.getElementById('fileContent');
    const lines = data.trim().split(/\r?\n/); // Split data into lines
    
    // Create a table element
    const table = document.createElement('table');
    
    // Iterate over each line in the CSV data
    lines.forEach((line, index) => {
        // Split the line into values
        const values = line.split(',');
        
        // Create a table row element
        const row = document.createElement('tr');
        
        // Iterate over each value in the line
        values.forEach((value) => {
            // Create a table cell element
            const cell = document.createElement('td');
            
            // Set the cell's text content to the current value
            cell.textContent = value;
            
            // Append the cell to the row
            row.appendChild(cell);
        });
        
        // Append the row to the table
        table.appendChild(row);
    });
    
    // Clear any existing content in the file content element
    fileContentElement.innerHTML = '';
    
    // Append the table to the file content element
    fileContentElement.appendChild(table);
}


// Function to parse CSV data
function parseCSVData(data) {
    const lines = data.trim().split(/\r?\n/); // Split data into lines
    const parsedData = lines.slice(1).map(line => {
        const values = line.split(','); // Split each line into values
        // Convert numerical values to numbers
        const parsedValues = values.map((value, index) => {
            return index !== 4 ? parseFloat(value) : value; // Parse numbers except for time
        });
        return parsedValues;
    });
    return parsedData;
}

// Function to prepare input for neural network
function prepareInput(data) {
    // Convert data into input format expected by neural network
    const input = data.map(row => row.map(parseFloat));
    return input;
}

// Function to display scan results
function displayResults(fraudulence) {
    resultSection.style.display = 'block';
    if (Array.isArray(fraudulence)) {
        resultContainer.innerHTML = `<p>Scan Results:</p>`;
        fraudulence.forEach((probability, index) => {
            resultContainer.innerHTML += `<p>Transaction ${index + 1}: Fraudulence Probability: ${probability}</p>`;
        });
    } else {
        resultContainer.innerHTML = `<p>Scan Results:</p><p>Fraudulence Probability: ${fraudulence}</p>`;
    }
}


// Function to display error message
function displayError(message) {
    resultSection.style.display = 'block';
    resultContainer.innerHTML = `<p>Error: ${message}</p>`;
}
