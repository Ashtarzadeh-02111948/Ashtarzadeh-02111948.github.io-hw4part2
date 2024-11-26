$(document).ready(function () {
    // Initialize sliders
    initializeSliders();

    // Initialize tabs
    $("#tabs").tabs();

    // Input validation rules
    const validateInputs = () => {
        const multiplicandMin = parseInt($("#multiplicandMin").val());
        const multiplicandMax = parseInt($("#multiplicandMax").val());
        const multiplierMin = parseInt($("#multiplierMin").val());
        const multiplierMax = parseInt($("#multiplierMax").val());

        if (
            isNaN(multiplicandMin) ||
            isNaN(multiplicandMax) ||
            isNaN(multiplierMin) ||
            isNaN(multiplierMax) ||
            multiplicandMin > multiplicandMax ||
            multiplierMin > multiplierMax
        ) {
            return false; // Invalid inputs
        }

        return true; // Valid inputs
    };

    // Add sliders for two-way binding
    function initializeSliders() {
        const sliderConfig = {
            min: -50,
            max: 50,
            step: 1,
            slide: function (event, ui) {
                const input = $(this).data("input");
                $(input).val(ui.value).trigger("change"); // Update input value
            }
        };

        // Sliders for each field
        $("#slider-multiplicandMin").slider(sliderConfig).data("input", "#multiplicandMin");
        $("#slider-multiplicandMax").slider(sliderConfig).data("input", "#multiplicandMax");
        $("#slider-multiplierMin").slider(sliderConfig).data("input", "#multiplierMin");
        $("#slider-multiplierMax").slider(sliderConfig).data("input", "#multiplierMax");

        // Bind input fields to sliders
        $("input[type='number']").on("input change", function () {
            const slider = $(this).siblings(".ui-slider");
            slider.slider("value", $(this).val());

            // Only update the table in the active tab if it's not the input tab
            const activeTabId = $("#tabs .ui-tabs-active").attr("aria-controls");
            if (activeTabId && activeTabId !== "tab-input" && validateInputs()) {
                updateTable(activeTabId); // Dynamically update table
            }
        });
    }

    // Generate table for the current values
    function generateTable() {
        const multiplicandMin = parseInt($("#multiplicandMin").val());
        const multiplicandMax = parseInt($("#multiplicandMax").val());
        const multiplierMin = parseInt($("#multiplierMin").val());
        const multiplierMax = parseInt($("#multiplierMax").val());

        const table = $("<table>").addClass("table table-bordered").attr("id", "multiplicationTable");

        // Header row
        const headerRow = $("<tr>");
        headerRow.append($("<th>").addClass("multiplier-header").text(""));
        for (let j = multiplierMin; j <= multiplierMax; j++) {
            headerRow.append($("<th>").addClass("multiplier-header").text(j));
        }
        table.append(headerRow);

        // Rows for multiplicands
        for (let i = multiplicandMin; i <= multiplicandMax; i++) {
            const row = $("<tr>");
            row.append($("<th>").addClass("multiplicand-header").text(i));
            for (let j = multiplierMin; j <= multiplierMax; j++) {
                row.append($("<td>").text(i * j));
            }
            table.append(row);
        }

        return table;
    }

    // Create a new tab with the current values
    function createNewTab() {
        if (!validateInputs()) {
            alert("Please ensure all inputs are valid: Min values must be less than Max values.");
            return;
        }

        const params = getParams();
        const table = generateTable();

        const tabs = $("#tabs");
        const tabIndex = tabs.find("ul li").length;
        const tabId = `tab-${tabIndex}`;

        // Add new tab
        tabs.find("ul").append(`
            <li>
                <a href="#${tabId}">${params}</a>
                <span class="ui-icon ui-icon-close" role="button"></span>
            </li>
        `);
        tabs.append(`<div id="${tabId}"></div>`);
        $(`#${tabId}`).append(table);

        tabs.tabs("refresh");
        tabs.tabs("option", "active", tabIndex);

        // Add close button logic
        tabs.find("ul li:last-child .ui-icon-close").on("click", function () {
            const panelId = $(this).closest("li").remove().attr("aria-controls");
            $(`#${panelId}`).remove();
            tabs.tabs("refresh");
        });
    }

    // Update the table in the active tab
    function updateTable(activeTabId) {
        const table = generateTable();
        $(`#${activeTabId}`).empty().append(table);
    }

    // Get parameters for tab title
    function getParams() {
        const multiplicandMin = $("#multiplicandMin").val();
        const multiplicandMax = $("#multiplicandMax").val();
        const multiplierMin = $("#multiplierMin").val();
        const multiplierMax = $("#multiplierMax").val();

        return `(${multiplicandMin}, ${multiplicandMax}) x (${multiplierMin}, ${multiplierMax})`;
    }

    // Attach click event to Generate Table button
    $("#generateButton").on("click", function (e) {
        e.preventDefault(); // Prevent default button behavior
        createNewTab(); // Always create a new tab
    });

    // Delete all tabs except the input tab
    $("#deleteTabs").on("click", function () {
        $("#tabs ul li").not(":first").each(function () {
            const panelId = $(this).remove().attr("aria-controls");
            $(`#${panelId}`).remove();
        });
        $("#tabs").tabs("refresh");
    });
});
