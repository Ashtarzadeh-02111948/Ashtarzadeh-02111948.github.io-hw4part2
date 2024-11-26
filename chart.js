$(document).ready(function () {
    initializeSliders();
    $("#tabs").tabs();

    // Form validation setup
    $("#tableInput").validate({
        rules: {
            multiplicandMin: {
                required: true,
                range: [-50, 50]
            },
            multiplicandMax: {
                required: true,
                range: [-50, 50],
                greaterThan: "#multiplicandMin"
            },
            multiplierMin: {
                required: true,
                range: [-50, 50]
            },
            multiplierMax: {
                required: true,
                range: [-50, 50],
                greaterThan: "#multiplierMin"
            }
        },
        messages: {
            multiplicandMin: {
                required: "Please enter a minimum value for multiplicand.",
                range: "Value must be between -50 and 50."
            },
            multiplicandMax: {
                required: "Please enter a maximum value for multiplicand.",
                range: "Value must be between -50 and 50.",
                greaterThan: "Maximum value must be greater than the minimum value."
            },
            multiplierMin: {
                required: "Please enter a minimum value for multiplier.",
                range: "Value must be between -50 and 50."
            },
            multiplierMax: {
                required: "Please enter a maximum value for multiplier.",
                range: "Value must be between -50 and 50.",
                greaterThan: "Maximum value must be greater than the minimum value."
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element);
        },
        submitHandler: function (form, event) {
            event.preventDefault(); // Prevent form submission
            generateNewTab(); // Create a new tab with the table
        }
    });

    // Custom validation method for "greaterThan"
    $.validator.addMethod("greaterThan", function (value, element, param) {
        const minValue = parseFloat($(param).val());
        return !isNaN(minValue) && parseFloat(value) > minValue;
    }, "Maximum value must be greater than the minimum value.");

    function initializeSliders() {
        const sliderConfig = {
            min: -50,
            max: 50,
            step: 1,
            slide: function (event, ui) {
                const input = $(this).data("input");
                $(input).val(ui.value).trigger("change"); // Update input dynamically
            }
        };

        $("#slider-multiplicandMin").slider(sliderConfig).data("input", "#multiplicandMin");
        $("#slider-multiplicandMax").slider(sliderConfig).data("input", "#multiplicandMax");
        $("#slider-multiplierMin").slider(sliderConfig).data("input", "#multiplierMin");
        $("#slider-multiplierMax").slider(sliderConfig).data("input", "#multiplierMax");

        // Bind inputs to dynamic updates
        $("input[type='number']").on("input change", function () {
            const slider = $(this).siblings(".ui-slider");
            slider.slider("value", $(this).val());

            if ($("#tableInput").valid()) {
                generateNewTab(true); // Automatically update table in the active tab
            }
        });
    }

    function generateTable() {
        const multiplicandMin = parseInt($("#multiplicandMin").val());
        const multiplicandMax = parseInt($("#multiplicandMax").val());
        const multiplierMin = parseInt($("#multiplierMin").val());
        const multiplierMax = parseInt($("#multiplierMax").val());

        if (
            isNaN(multiplicandMin) ||
            isNaN(multiplicandMax) ||
            isNaN(multiplierMin) ||
            isNaN(multiplierMax)
        ) {
            return $("<div>").text("Invalid inputs. Please check your entries.");
        }

        const table = $("<table>").addClass("table table-bordered");

        // Add header row
        const headerRow = $("<tr>");
        headerRow.append($("<th>").addClass("multiplier-header").text(""));
        for (let j = multiplierMin; j <= multiplierMax; j++) {
            headerRow.append($("<th>").addClass("multiplier-header").text(j));
        }
        table.append(headerRow);

        // Add rows for multiplicands
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

    function generateNewTab(updateActive = false) {
        const multiplicandMin = parseInt($("#multiplicandMin").val());
        const multiplicandMax = parseInt($("#multiplicandMax").val());
        const multiplierMin = parseInt($("#multiplierMin").val());
        const multiplierMax = parseInt($("#multiplierMax").val());

        if (
            isNaN(multiplicandMin) ||
            isNaN(multiplicandMax) ||
            isNaN(multiplierMin) ||
            isNaN(multiplierMax)
        ) {
            alert("Please fill out all fields with valid values.");
            return;
        }

        const params = `${multiplicandMin}-${multiplicandMax} x ${multiplierMin}-${multiplierMax}`;
        const table = generateTable();

        if (updateActive) {
            const activeTab = $("#tabs .ui-tabs-active").attr("aria-controls");
            $(`#${activeTab}`).empty().append(table);
            return;
        }

        addTab(table, params);
    }

    function addTab(table, params) {
        const tabs = $("#tabs");
        const tabIndex = tabs.find("ul li").length;
        const tabId = `tab-${tabIndex}`;

        tabs.find("ul").append(`
            <li>
                <a href="#${tabId}">${params}</a>
                <span class="ui-icon ui-icon-close"></span>
            </li>
        `);

        tabs.append(`<div id="${tabId}"></div>`);
        $(`#${tabId}`).append(table);
        tabs.tabs("refresh");

        // Add close functionality
        tabs.find("ul li:last-child .ui-icon-close").on("click", function () {
            const panelId = $(this).closest("li").remove().attr("aria-controls");
            $(`#${panelId}`).remove();
            tabs.tabs("refresh");
        });

        // Activate the new tab
        tabs.tabs("option", "active", tabIndex);
    }

    $("#deleteTabs").on("click", function () {
        $("#tabs ul li").not(":first").each(function () {
            const panelId = $(this).remove().attr("aria-controls");
            $(`#${panelId}`).remove();
        });
        $("#tabs").tabs("refresh");
    });
});
