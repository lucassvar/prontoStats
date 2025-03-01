// Load Google Charts library
google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(drawCharts); // Ensure all charts are drawn after the library loads


// Function to draw all charts
function drawCharts() {
    // PLOT: Best Picture Winners
    fetch('/letterboxd-wrapped/docs/best_pic_winners.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load best_pic_winners.json');
            return response.json();
        })
        .then(data => {
            console.log('best_pic_winners data:', data); // Debugging statement
            bestPicWinners(data);

            // Add event listener to the submit button if it exists
            const submitButtonWrapped = document.getElementById('submitButtonWrapped');
            if (submitButtonWrapped) {
                submitButtonWrapped.addEventListener('click', () => bestPicWinners(data));
            } else {
                console.warn('Button with id "submitButtonWrapped" not found.');
            }
        })
        .catch(error => console.error('Error fetching best_pic_winners data:', error));
    
    
    // PLOT: Top 100 Argentina
    fetch('/letterboxd-wrapped/docs/top100_Arg.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load top100_Arg.json');
            return response.json();
        })
        .then(data => {
            console.log('prontoMovies data:', data); // Debugging statement
            top100_Arg(data);

            // Add event listener to the submit button if it exists
            const submitButtonWrapped = document.getElementById('submitButtonWrapped');
            if (submitButtonWrapped) {
                submitButtonWrapped.addEventListener('click', () => top100_Arg(data));
            } else {
                console.warn('Button with id "submitButtonWrapped" not found.');
            }
        })
        .catch(error => console.error('Error fetching top100_Arg data:', error));
    
    
    // PLOT: Top Releases Resumitos
    fetch('/letterboxd-wrapped/docs/top_releases_resumitos.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load top_releases_resumitos.json');
            return response.json();
        })
        .then(data => {
            console.log('topReleasesResumitos data:', data); // Debugging statement
            topReleasesResumitos(data);

            // Add event listener to the submit button if it exists
            const submitButtonWrapped = document.getElementById('submitButtonWrapped');
            if (submitButtonWrapped) {
                submitButtonWrapped.addEventListener('click', () => topReleasesResumitos(data));
            } else {
                console.warn('Button with id "submitButtonWrapped" not found.');
            }
        })
        .catch(error => console.error('Error fetching topReleasesResumitos data:', error));
    

    // PLOT: Top Movies Resumitos
    fetch('/letterboxd-wrapped/docs/top_movies_resumitos.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load top_movies_resumitos.json');
            return response.json();
        })
        .then(data => {
            console.log('topMoviesResumitos data:', data); // Debugging statement
            topMoviesResumitos(data);

            // Add event listener to the submit button if it exists
            const submitButtonWrapped = document.getElementById('submitButtonWrapped');
            if (submitButtonWrapped) {
                submitButtonWrapped.addEventListener('click', () => topMoviesResumitos(data));
            } else {
                console.warn('Button with id "submitButtonWrapped" not found.');
            }
        })
        .catch(error => console.error('Error fetching topMoviesResumitos data:', error));

    
    // PLOT: Top Watched on Stream Resumitos
    fetch('/letterboxd-wrapped/docs/top_stream_resumitos.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load top_stream_resumitos.json');
            return response.json();
        })
        .then(data => {
            console.log('topStreamResumitos data:', data); // Debugging statement
            topStreamResumitos(data);

            // Add event listener to the submit button if it exists
            const submitButtonWrapped = document.getElementById('submitButtonWrapped');
            if (submitButtonWrapped) {
                submitButtonWrapped.addEventListener('click', () => topStreamResumitos(data));
            } else {
                console.warn('Button with id "submitButtonWrapped" not found.');
            }
        })
        .catch(error => console.error('Error fetching topStreamResumitos data:', error));

    
    // PLOT: graphics made with user_ratings data
    fetch('/letterboxd-wrapped/docs/user_ratings.json')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load user_ratings.json');
        return response.json();
    })
    .then(data => {
        console.log('MatchingScore MatchingMovies data:', data); // Debugging statement
        MatchingScore(data);
        MatchingMovies(data);
        avgBenevoleceScore(data);
        compared_TopPositiveDiff(data);
        compared_TopNegativeDiff(data);
        comparedBenevolenceScore(data);

        // Ensure only positive differences are shown by default
        document.getElementById('compared_topPositiveDiff_id').style.display = 'flex';
        document.getElementById('compared_topNegativeDiff_id').style.display = 'none';

        // Event listener for submit button
        const submitButtonWrapped = document.getElementById('submitButtonWrapped');
        if (submitButtonWrapped) {
            submitButtonWrapped.addEventListener('click', () => {
                console.log('submitButtonWrapped clicked');
                MatchingScore(data);
                MatchingMovies(data);
                avgBenevoleceScore(data);
                compared_TopPositiveDiff(data);
                compared_TopNegativeDiff(data);
                comparedBenevolenceScore(data);

                document.getElementById('compared_topPositiveDiff_id').style.display = 'flex';
                document.getElementById('compared_topNegativeDiff_id').style.display = 'none';
            });
        } else {
            console.warn('Button with id "submitButtonWrapped" not found.');
        }

        // Event listener for compare button
        const compareButtonWrapped = document.getElementById('compareButtonWrapped');
        if (compareButtonWrapped) {
            compareButtonWrapped.addEventListener('click', () => {
                console.log('compareButtonWrapped clicked');
                MatchingScore(data);
                MatchingMovies(data);
                compared_TopPositiveDiff(data);
                compared_TopNegativeDiff(data);
                comparedBenevolenceScore(data);

                document.getElementById('compared_topPositiveDiff_id').style.display = 'flex';
                document.getElementById('compared_topNegativeDiff_id').style.display = 'none';
            });
        } else {
            console.warn('Button with id "compareButtonWrapped" not found.');
        }

        // Event listeners for Positive and Negative buttons
        const positiveButton = document.getElementById('compared_topPositiveDiff_button');
        const negativeButton = document.getElementById('compared_topNegativeDiff_button');

        if (positiveButton) {
            positiveButton.addEventListener('click', () => {
                document.getElementById('compared_topPositiveDiff_id').style.display = 'flex';
                document.getElementById('compared_topNegativeDiff_id').style.display = 'none';
            });
        }

        if (negativeButton) {
            negativeButton.addEventListener('click', () => {
                document.getElementById('compared_topPositiveDiff_id').style.display = 'none';
                document.getElementById('compared_topNegativeDiff_id').style.display = 'flex';
            });
        }
    })
    .catch(error => console.error('Error fetching MatchingScore MatchingMovies data:', error));



}



// PLOT: Best Picture Winners
let bestPicWinnersChart = null; // Global variable to store the chart instance
function bestPicWinners(user_data) {
    console.log('bestPicWinners called with data:', user_data); // Debugging statement
    const userInput = document.getElementById('userInput'); // Get the user input

    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }

    const selectedUser = userInput.value.trim();

    // Filter data if input is not empty
    let filteredData = user_data;
    if (selectedUser) {
        filteredData = user_data.filter(item => item.user === selectedUser);
    }

    // Extract labels and data for the chart
    const labels = filteredData.map(item => item.condition);
    const data = filteredData.map(item => item.percentage);

    // Find the percentage value for "Vistos"
    const vistosEntry = filteredData.find(item => item.condition === "Vistos");
    const vistosPercentage = vistosEntry ? `${vistosEntry.percentage}%` : 'N/A';

    // Destroy existing chart instance if it exists
    if (bestPicWinnersChart) {
        bestPicWinnersChart.destroy();
    }

    // Create a new chart instance
    bestPicWinnersChart = new Chart(
        document.getElementById("bestPicWinners_id"),
        {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#A64253', '#131313'], // Colors for 'Viejas' and 'Estrenos'
                    hoverBackgroundColor: ['#DC7283', '#515151'], // Hover colors for 'Viejas' and 'Estrenos'
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { width } = chart;
                    const { ctx } = chart;
                    ctx.save();
                    ctx.fillStyle = '#333';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Dynamically adjust font size with min and max limits
                    let fontSize = Math.max(16, Math.min(width / 10, 20)); // Min 16px, Max 20px
                    ctx.font = `bold ${fontSize}px Arial`; // Set the font size

                    const centerX = width / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

                    ctx.fillText(vistosPercentage, centerX, centerY);
                    ctx.restore();
                }
            }]
        }
    );
}


// PLOT: Top 100 Argentina
let top100_ArgChart = null; // Global variable to store the chart instance
function top100_Arg(user_data) {
    console.log('top100_Arg called with data:', user_data); // Debugging statement
    const userInput = document.getElementById('userInput'); // Get the user input

    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }

    const selectedUser = userInput.value.trim();

    // Filter data if input is not empty
    let filteredData = user_data;
    if (selectedUser) {
        filteredData = user_data.filter(item => item.user === selectedUser);
    }

    // Extract labels and data for the chart
    const labels = filteredData.map(item => item.condition);
    const data = filteredData.map(item => item.percentage);

    // Find the percentage value for "Vistos"
    const vistosEntry = filteredData.find(item => item.condition === "Vistos");
    const vistosPercentage = vistosEntry ? `${vistosEntry.percentage}%` : 'N/A';

    // Destroy existing chart instance if it exists
    if (top100_ArgChart) {
        top100_ArgChart.destroy();
    }

    // Create a new chart instance
    top100_ArgChart = new Chart(
        document.getElementById("top100Arg_id"),
        {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#A64253', '#131313'], // Colors for 'Viejas' and 'Estrenos'
                    hoverBackgroundColor: ['#DC7283', '#515151'], // Hover colors for 'Viejas' and 'Estrenos'
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: (chart) => {
                    const { width } = chart;
                    const { ctx } = chart;
                    ctx.save();
                    ctx.fillStyle = '#333';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Dynamically adjust font size with min and max limits
                    let fontSize = Math.max(16, Math.min(width / 10, 20)); // Min 16px, Max 20px
                    ctx.font = `bold ${fontSize}px Arial`; // Set the font size

                    const centerX = width / 2;
                    const centerY = chart.chartArea.top + (chart.chartArea.bottom - chart.chartArea.top) / 2;

                    ctx.fillText(vistosPercentage, centerX, centerY);
                    ctx.restore();
                }
            }]
        }
    );
}


// PLOT: Top Releases Resumitos
function topReleasesResumitos(user_data) {
    const container = document.getElementById('topReleasesResumitos_id'); // Get the container element

    if (!container) {
        console.error('Element with id "topReleasesResumitos_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = item.movie;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        const avg_resumito_rating = document.createElement('div');
        avg_resumito_rating.textContent = item.avg_resumito_rating + ' ★';
        avg_resumito_rating.style.marginTop = '5px';
        avg_resumito_rating.style.color = '#131313'; // Change avg_resumito_rating color to a darker grey

        movieDiv.appendChild(img);
        movieDiv.appendChild(avg_resumito_rating);
        container.appendChild(movieDiv);
    });
}


// PLOT: Top Movies Resumitos
function topMoviesResumitos(user_data) {
    const container = document.getElementById('topMoviesResumitos_id'); // Get the container element

    if (!container) {
        console.error('Element with id "topMoviesResumitos_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = item.movie;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        const avg_resumito_rating = document.createElement('div');
        avg_resumito_rating.textContent = item.avg_resumito_rating + ' ★';
        avg_resumito_rating.style.marginTop = '5px';
        avg_resumito_rating.style.color = '#131313'; // Change avg_resumito_rating color to a darker grey

        movieDiv.appendChild(img);
        movieDiv.appendChild(avg_resumito_rating);
        container.appendChild(movieDiv);
    });
}


// PLOT: Top Watched on Stream Resumitos
function topStreamResumitos(user_data) {
    const container = document.getElementById('topStreamResumitos_id'); // Get the container element

    if (!container) {
        console.error('Element with id "topStreamResumitos_id" not found.');
        return; // Stop execution if container doesn't exist
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a new div for each movie
    user_data.forEach(item => {
        const movieDiv = document.createElement('div');
        movieDiv.style.display = 'inline-block';
        movieDiv.style.margin = '20px';
        movieDiv.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = item.movie;
        img.style.width = '100px';
        img.style.height = '150px';
        img.style.display = 'block';

        const avg_resumito_rating = document.createElement('div');
        avg_resumito_rating.textContent = item.avg_resumito_rating + ' ★';
        avg_resumito_rating.style.marginTop = '5px';
        avg_resumito_rating.style.color = '#131313'; // Change avg_resumito_rating color to a darker grey

        movieDiv.appendChild(img);
        movieDiv.appendChild(avg_resumito_rating);
        container.appendChild(movieDiv);
    });
}


// PLOT: Matching score with compareInput
function MatchingScore(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Get the compare input
    const compareInput = document.getElementById('compareInput');
    if (!compareInput) {
        console.error('Element with id "compareInput" not found.');
        return; // Stop execution if compareInput doesn't exist
    }
    const compare_input = compareInput.value.trim();

    // Filter datasets by user
    const userData = user_data.filter(row => row.user === selectedUser);
    const compareData = user_data.filter(row => row.user === compare_input);

    // Create sets of titles for both users
    const userTitles = new Set(userData.map(row => row.movie_query));
    const compareTitles = new Set(compareData.map(row => row.movie_query));

    // Find common titles
    const commonTitles = [...userTitles].filter(movie_query => compareTitles.has(movie_query));

    // Filter datasets by common titles
    const filteredUserData = userData.filter(row => commonTitles.includes(row.movie_query));
    const filteredCompareData = compareData.filter(row => commonTitles.includes(row.movie_query));

    // Create maps for quick lookup
    const userRatings = new Map(filteredUserData.map(row => [row.movie_query, row.rating]));
    const compareRatings = new Map(filteredCompareData.map(row => [row.movie_query, row.rating]));

    // Calculate similarity score
    let totalDifference = 0;
    commonTitles.forEach(movie_query => {
        const rating1 = userRatings.get(movie_query);
        const rating2 = compareRatings.get(movie_query);
        totalDifference += Math.abs(rating1 - rating2);
    });

    const maxDifference = commonTitles.length * 9; // Max difference per movie_query is 9 (10-1)
    const similarityScore = commonTitles.length > 0 
        ? ((1 - totalDifference / maxDifference) * 100).toFixed(2) 
        : 0;

    
    // Determine font color based on similarityScore
    let fontColor = '';
    if (similarityScore <= 25) {
        fontColor = 'darkred';
    } else if (similarityScore <= 50) {
        fontColor = 'red';
    } else if (similarityScore <= 75) {
        fontColor = 'lightgreen';
    } else {
        fontColor = 'darkgreen';
    }

    // Display result in the div with id 'matching_score_id'
    const resultDiv = document.getElementById('matching_score_id');
    if (resultDiv) {
        resultDiv.style.fontFamily = 'Arial, sans-serif';
        resultDiv.style.fontSize = '40px';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.color = fontColor;
        resultDiv.innerHTML = `${similarityScore}%`;
    }
}


// PLOT: Movies of compared user watched
function MatchingMovies(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Get the compare input
    const compareInput = document.getElementById('compareInput');
    if (!compareInput) {
        console.error('Element with id "compareInput" not found.');
        return; // Stop execution if compareInput doesn't exist
    }
    const compare_input = compareInput.value.trim();
    // Filter datasets by user
    const userData = user_data.filter(row => row.user === selectedUser);
    const compareData = user_data.filter(row => row.user === compare_input);

    // Create sets of titles for both users
    const userTitles = new Set(userData.map(row => row.movie_query));
    const compareTitles = new Set(compareData.map(row => row.movie_query));

    // Find common titles
    const commonTitles = [...compareTitles].filter(movie_query => userTitles.has(movie_query));

    // Calculate overlap percentage
    const overlapPercentage = compareTitles.size > 0 
        ? ((commonTitles.length / compareTitles.size) * 100).toFixed(2) 
        : 0;

    // Determine font color based on overlapPercentage
    let fontColor = '';
    if (overlapPercentage <= 25) {
        fontColor = 'darkred';
    } else if (overlapPercentage <= 50) {
        fontColor = 'red';
    } else if (overlapPercentage <= 75) {
        fontColor = 'lightgreen';
    } else {
        fontColor = 'darkgreen';
    }

    // Display result in the div with id 'movies_in_common_id'
    const resultDiv = document.getElementById('movies_in_common_id');
    if (resultDiv) {
        resultDiv.style.fontFamily = 'Arial, sans-serif';
        resultDiv.style.fontSize = '40px';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.color = fontColor;
        resultDiv.innerHTML = `${overlapPercentage}%`;
    }
}


// PLOT: Benevolece Score vs. average
function avgBenevoleceScore(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Filter dataset by user
    const userData = user_data.filter(row => row.user === selectedUser);

    // Filter out rows with missing ratings
    const validData = userData.filter(row => row.rating != null && row.avg_rating != null);

    // Calculate the benevolence score
    let totalDifference = 0;
    validData.forEach(row => {
        totalDifference += row.rating - row.avg_rating;
    });

    const benevolenceScore = validData.length > 0 
        ? ((totalDifference / validData.length) * 10).toFixed(2) // Scale to percentage
        : 0;

    // Determine font color based on benevolenceScore
    let fontColor = '';
    if (benevolenceScore < -25) {
        fontColor = 'darkred';
    } else if (benevolenceScore < 0) {
        fontColor = 'red';
    } else if (benevolenceScore <= 25) {
        fontColor = 'lightgreen';
    } else {
        fontColor = 'darkgreen';
    }

    // Display result in the div with id 'avg_benevolence_score_id'
    const resultDiv = document.getElementById('avg_benevolence_score_id');
    if (resultDiv) {
        resultDiv.style.fontFamily = 'Arial, sans-serif';
        resultDiv.style.fontSize = '40px';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.color = fontColor;
        resultDiv.innerHTML = `${benevolenceScore}%`;
    }
}


// PLOT: Top Positive Difference
function compared_TopPositiveDiff(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Get the compare input
    const compareInput = document.getElementById('compareInput');
    if (!compareInput) {
        console.error('Element with id "compareInput" not found.');
        return; // Stop execution if compareInput doesn't exist
    }
    const compare_input = compareInput.value.trim();

    // Filter datasets by user
    const userData = user_data.filter(row => row.user === selectedUser);
    const compareData = user_data.filter(row => row.user === compare_input);

    // Step 2: Filter compare_input to only include movie_query present in user_input
    const userMovieQueries = new Set(userData.map(row => row.movie_query));
    const filteredCompareData = compareData.filter(row => userMovieQueries.has(row.movie_query));

    // Step 3: Merge compareData into userData based on movie_query
    const mergedData = userData.map(userRow => {
        const compareRow = filteredCompareData.find(row => row.movie_query === userRow.movie_query);
        return {
            ...userRow,
            compared_rating: compareRow ? compareRow.rating : null,
            compared_star_rating: compareRow ? compareRow.star_rating : null,
            difference: compareRow ? userRow.rating - compareRow.rating : null
        };
    });

    // Step 4: Sort by difference and get top 6
    const topDifferences = mergedData
        .filter(row => row.difference !== null)
        .sort((a, b) => b.difference - a.difference)
        .slice(0, 6);

    // Step 5: Display images and labels
    const container = document.getElementById('compared_topPositiveDiff_id');
    if (container) {
        container.innerHTML = ''; // Clear existing content
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '20px';
        container.style.justifyContent = 'center';

        topDifferences.forEach(row => {
            const card = document.createElement('div');
            card.style.display = 'inline-block';
            card.style.margin = '10px';
            card.style.textAlign = 'center';

            // Image
            const img = document.createElement('img');
            img.src = row.film_poster; // Using 'film_poster' for image URL
            img.style.width = '100px';
            img.style.height = '150px';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.style.marginBottom = '8px';

            // Star Rating Label
            const starRating = document.createElement('div');
            starRating.textContent = `${row.star_rating}`;
            starRating.style.fontSize = '14px';
            starRating.style.fontWeight = 'bold';
            starRating.style.color = 'green';

            // Compared Star Rating Label
            const comparedStarRating = document.createElement('div');
            comparedStarRating.textContent = `${row.compared_star_rating}`;
            comparedStarRating.style.fontSize = '14px';
            comparedStarRating.style.fontWeight = 'bold';
            comparedStarRating.style.color = '#131313';

            // Append elements
            card.appendChild(img);
            card.appendChild(starRating);
            card.appendChild(comparedStarRating);

            container.appendChild(card);
        });
    }
}


// PLOT: Top Negative Difference
function compared_TopNegativeDiff(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Get the compare input
    const compareInput = document.getElementById('compareInput');
    if (!compareInput) {
        console.error('Element with id "compareInput" not found.');
        return; // Stop execution if compareInput doesn't exist
    }
    const compare_input = compareInput.value.trim();

    // Filter datasets by user
    const userData = user_data.filter(row => row.user === selectedUser);
    const compareData = user_data.filter(row => row.user === compare_input);

    // Step 2: Filter compare_input to only include movie_query present in user_input
    const userMovieQueries = new Set(userData.map(row => row.movie_query));
    const filteredCompareData = compareData.filter(row => userMovieQueries.has(row.movie_query));

    // Step 3: Merge compareData into userData based on movie_query
    const mergedData = userData.map(userRow => {
        const compareRow = filteredCompareData.find(row => row.movie_query === userRow.movie_query);
        return {
            ...userRow,
            compared_rating: compareRow ? compareRow.rating : null,
            compared_star_rating: compareRow ? compareRow.star_rating : null,
            difference: compareRow ? userRow.rating - compareRow.rating : null
        };
    });

    // Step 4: Sort by difference (ascending) and get bottom 6
    const bottomDifferences = mergedData
        .filter(row => row.difference !== null)
        .sort((a, b) => a.difference - b.difference)
        .slice(0, 6);

    // Step 5: Display images and labels
    const container = document.getElementById('compared_topNegativeDiff_id');
    if (container) {
        container.innerHTML = ''; // Clear existing content
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '20px';
        container.style.justifyContent = 'center';

        bottomDifferences.forEach(row => {
            const card = document.createElement('div');
            card.style.display = 'inline-block';
            card.style.margin = '10px';
            card.style.textAlign = 'center';

            // Image
            const img = document.createElement('img');
            img.src = row.film_poster; // Using 'film_poster' for image URL
            img.style.width = '100px';
            img.style.height = '150px';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.style.marginBottom = '8px';

            // Star Rating Label
            const starRating = document.createElement('div');
            starRating.textContent = `${row.star_rating}`;
            starRating.style.fontSize = '14px';
            starRating.style.fontWeight = 'bold';
            starRating.style.color = 'red';

            // Compared Star Rating Label
            const comparedStarRating = document.createElement('div');
            comparedStarRating.textContent = `${row.compared_star_rating}`;
            comparedStarRating.style.fontSize = '14px';
            comparedStarRating.style.fontWeight = 'bold';
            comparedStarRating.style.color = '#131313';

            // Append elements
            card.appendChild(img);
            card.appendChild(starRating);
            card.appendChild(comparedStarRating);

            container.appendChild(card);
        });
    }
}


// PLOT: Benevolence score vs. user
function comparedBenevolenceScore(user_data) {
    // Get the user input
    const userInput = document.getElementById('userInput');
    if (!userInput) {
        console.error('Element with id "userInput" not found.');
        return; // Stop execution if userInput doesn't exist
    }
    const selectedUser = userInput.value.trim();

    // Get the compare input
    const compareInput = document.getElementById('compareInput');
    if (!compareInput) {
        console.error('Element with id "compareInput" not found.');
        return; // Stop execution if compareInput doesn't exist
    }
    const compare_input = compareInput.value.trim();

    // If both users are the same, return a score of 0 directly
    if (selectedUser === compare_input) {
        const container = document.getElementById('compared_benevolenceScore_id');
        if (container) {
            container.innerHTML = ''; // Clear previous content
            const scoreElement = document.createElement('div');
            scoreElement.style.fontFamily = 'Arial, sans-serif';
            scoreElement.style.fontSize = '40px';
            scoreElement.style.fontWeight = 'bold';
            scoreElement.textContent = `0%`;
            scoreElement.style.color = 'black'; // 0% benevolence score is neutral and green
            container.appendChild(scoreElement);
        }
        return;
    }

    // Filter datasets by user
    const userData = user_data.filter(row => row.user === selectedUser);
    const compareData = user_data.filter(row => row.user === compare_input);

    // Step 2: Filter compare_input to only include movie_query present in user_input
    const userMovieQueries = new Set(userData.map(row => row.movie_query));
    const filteredCompareData = compareData.filter(row => userMovieQueries.has(row.movie_query));

    // Step 3: Merge compareData into userData based on movie_query
    const mergedData = userData.map(userRow => {
        const compareRow = filteredCompareData.find(row => row.movie_query === userRow.movie_query);
        return {
            ...userRow,
            compared_rating: compareRow ? compareRow.rating : null
        };
    });

    // Calculate the benevolence score
    let totalDifference = 0;
    mergedData.forEach(row => {
        totalDifference += row.rating - row.compared_rating;
    });

    const benevolenceScore = mergedData.length > 0 
        ? ((totalDifference / mergedData.length) * 10).toFixed(2) // Scale to percentage
        : 0;

    // Step 5: Display benevolence score with color change based on the value
    let fontColor = '';
    if (benevolenceScore < -25) {
        fontColor = 'darkred';
    } else if (benevolenceScore < 0) {
        fontColor = 'red';
    } else if (benevolenceScore <= 25) {
        fontColor = 'lightgreen';
    } else {
        fontColor = 'darkgreen';
    }

    // Display result in the div with id 'compared_benevolenceScore_id'
    const resultDiv = document.getElementById('compared_benevolenceScore_id');
    if (resultDiv) {
        resultDiv.style.fontFamily = 'Arial, sans-serif';
        resultDiv.style.fontSize = '40px';
        resultDiv.style.fontWeight = 'bold';
        resultDiv.style.color = fontColor;
        resultDiv.innerHTML = `${benevolenceScore}%`;
    }
}






















// Event Listeners for the plot buttons (ONLY DUALS)
const buttonPairs = [
    ['compared_topPositiveDiff', 'compared_topNegativeDiff']
];

buttonPairs.forEach(([btn1, btn2]) => {
    document.getElementById(`${btn1}_button`).addEventListener('click', function() {
        document.getElementById(`${btn1}_id`).style.display = 'block';
        document.getElementById(`${btn2}_id`).style.display = 'none';
        this.classList.add('selected');
        document.getElementById(`${btn2}_button`).classList.remove('selected');
    });

    document.getElementById(`${btn2}_button`).addEventListener('click', function() {
        document.getElementById(`${btn1}_id`).style.display = 'none';
        document.getElementById(`${btn2}_id`).style.display = 'block';
        this.classList.add('selected');
        document.getElementById(`${btn1}_button`).classList.remove('selected');
    });
});



// Event Listeners for the plot buttons (ONLY TRIOS)
const buttons = [
    'topReleasesResumitos',
    'topMoviesResumitos',
    'topStreamResumitos'
];

buttons.forEach((button) => {
    document.getElementById(`${button}_button`).addEventListener('click', function() {
        buttons.forEach((btn) => {
            document.getElementById(`${btn}_id`).style.display = btn === button ? 'block' : 'none';
            document.getElementById(`${btn}_button`).classList.toggle('selected', btn === button);
        });
    });
});


