//#region Global Vars
let modalDialogData,
    generalLinkElement,
    linkTextTextbox,
    linkTypeDropdown,
    linkTypeExternal, linkTypeInternal, linkTypeMailto, linkTypePhoneNumber, linkTypeAnchorOrQueryStringOnly,
    externalLinkUrlTextbox,
    internalLinkUrlTextbox, internalLinkTypeTextbox, internalLinkGuidTextbox,
    mailtoEmailAddressTextbox, mailtoEmailCcTextbox, mailtoEmailBccTextbox, mailtoEmailSubjectTextbox, mailtoEmailBodyTextbox,
    phoneNumberTextbox,
    anchorOrQueryStringTextbox,
    testLinkButton,
    openInNewTabCheckbox,
    customCssClassesDropdown, customCssClassesTextbox;
//#endregion

//#region Init
function initGeneralLinkModalDialog() {
    //#region Populate global variables
    modalDialogData = kentico.modalDialog.getData();
    generalLinkElement = document.getElementById('js-general-link');
    linkTextTextbox = document.getElementById(generalLinkElement.dataset.linkTextTextboxId);
    linkTypeDropdown = document.getElementById(generalLinkElement.dataset.linkTypeDropdownId);
    linkTypeExternal = generalLinkElement.dataset.linkTypeExternal;
    linkTypeInternal = generalLinkElement.dataset.linkTypeInternal;
    linkTypeMailto = generalLinkElement.dataset.linkTypeMailto;
    linkTypePhoneNumber = generalLinkElement.dataset.linkTypePhoneNumber;
    linkTypeAnchorOrQueryStringOnly = generalLinkElement.dataset.linkTypeAnchorOrQueryStringOnly;
    externalLinkUrlTextbox = document.getElementById(generalLinkElement.dataset.externalLinkUrlTextboxId);
    internalLinkUrlTextbox = document.getElementById(generalLinkElement.dataset.internalLinkUrlTextboxId);
    internalLinkTypeTextbox = document.getElementById(generalLinkElement.dataset.internalLinkTypeTextboxId);
    internalLinkGuidTextbox = document.getElementById(generalLinkElement.dataset.internalLinkGuidTextboxId);
    mailtoEmailAddressTextbox = document.getElementById(generalLinkElement.dataset.mailtoEmailAddressTextboxId);
    mailtoEmailCcTextbox = document.getElementById(generalLinkElement.dataset.mailtoEmailCcTextboxId);
    mailtoEmailBccTextbox = document.getElementById(generalLinkElement.dataset.mailtoEmailBccTextboxId);
    mailtoEmailSubjectTextbox = document.getElementById(generalLinkElement.dataset.mailtoEmailSubjectTextboxId);
    mailtoEmailBodyTextbox = document.getElementById(generalLinkElement.dataset.mailtoEmailBodyTextboxId);
    phoneNumberTextbox = document.getElementById(generalLinkElement.dataset.phoneNumberTextboxId);
    anchorOrQueryStringTextbox = document.getElementById(generalLinkElement.dataset.anchorOrQueryStringTextboxId);
    testLinkButton = document.getElementById(generalLinkElement.dataset.testLinkButtonId);
    openInNewTabCheckbox = document.getElementById(generalLinkElement.dataset.openInNewTabCheckboxId);
    customCssClassesTextbox = document.getElementById(generalLinkElement.dataset.customCssClassesTextboxId);
    //#endregion

    //#region Create and populate custom CSS classes dropdown
    let customCssClasses = modalDialogData.customCssClasses;
    if (customCssClasses && customCssClasses.length > 0) {
        let wrapper = document.getElementById('js-custom-css-classes');

        // Create the select tag (dropdown)
        let dropdown = document.createElement('select');
        dropdown.id = generalLinkElement.dataset.customCssClassesDropdownId;

        // Add empty option as first element
        let emptyOption = document.createElement('option');
        emptyOption.value = '';
        dropdown.add(emptyOption);

        // Populate dropdown with values from CustomCssClasses C# property's EditingComponentProperty attribute
        let customCssClassesSplit = customCssClasses.split('\r\n');
        for (var i = 0; i <= customCssClassesSplit.length - 1; i++) {
            var option = document.createElement('option');
            option.text = customCssClassesSplit[i].split(';')[1];
            option.value = customCssClassesSplit[i].split(';')[0];
            dropdown.add(option);
        }
        wrapper.prepend(dropdown);
        customCssClassesDropdown = document.getElementById(generalLinkElement.dataset.customCssClassesDropdownId);
    }
    //#endregion

    //#region Prepopulate fields if provided (Edit General Link)
    if (modalDialogData.existingLink) {
        linkTextTextbox.value = modalDialogData.existingLink.linkText;
        linkTypeDropdown.value = modalDialogData.existingLink.linkType;
        anchorOrQueryStringTextbox.value = modalDialogData.existingLink.anchorOrQueryString;
        openInNewTabCheckbox.checked = modalDialogData.existingLink.openInNewTab;
        customCssClassesTextbox.value = modalDialogData.existingLink.customCssClassesTextbox;

        if (modalDialogData.customCssClasses
            && modalDialogData.existingLink.customCssClassesDropdown
            && modalDialogData.existingLink.customCssClassesDropdown.length > 0) {
            let classesDropdown = document.getElementById(generalLinkElement.dataset.customCssClassesDropdownId);
            if (classesDropdown) {
                classesDropdown.value = modalDialogData.existingLink.customCssClassesDropdown;
            }
        }

        switch (String(modalDialogData.existingLink.linkType)) {
            case linkTypeExternal:
                externalLinkUrlTextbox.value = modalDialogData.existingLink.link.url;
                break;
            case linkTypeInternal:
                internalLinkUrlTextbox.value = modalDialogData.existingLink.link.url;
                internalLinkTypeTextbox.value = modalDialogData.existingLink.link.internalReferenceType;
                internalLinkGuidTextbox.value = modalDialogData.existingLink.link.internalReferenceGuid;
                break;
            case linkTypeMailto:
                mailtoEmailAddressTextbox.value = modalDialogData.existingLink.link.emailAddress;
                mailtoEmailCcTextbox.value = modalDialogData.existingLink.link.emailCc;
                mailtoEmailBccTextbox.value = modalDialogData.existingLink.link.emailBcc;
                mailtoEmailSubjectTextbox.value = modalDialogData.existingLink.link.emailSubject;
                mailtoEmailBodyTextbox.value = modalDialogData.existingLink.link.emailBody;
                break;
            case linkTypePhoneNumber:
                phoneNumberTextbox.value = modalDialogData.existingLink.link.phoneNumber;
                break;
        }

        linkTypeDropdownChanged(linkTypeDropdown);
    }
    //#endregion

    //#region Register validation extensions
    $.validator.addMethod('requiredif',
        function (value, element, parameters) {
            var id = `#${parameters['dependentproperty']}`;
            // get the target value (as a string, as that's what actual value will be)
            var targetvalue = parameters['targetvalue'];
            targetvalue = (targetvalue == null ? '' : targetvalue).toString();
            // get the actual value of the target control
            // note - this probably needs to cater for more control types, e.g. radios
            var control = $(id);
            var controltype = control.attr('type');
            var actualvalue = controltype === 'checkbox'
                ? control.attr('checked').toString()
                : control.val();
            // if the condition is true, reuse the existing required field validator functionality
            if (targetvalue === actualvalue) {
                return $.validator.methods.required.call(this, value, element, parameters);
            }
            return true;
        }
    );
    $.validator.unobtrusive.adapters.add(
        'requiredif',
        ['dependentproperty', 'targetvalue'],
        function (options) {
            options.rules['requiredif'] = {
                dependentproperty: options.params['dependentproperty'],
                targetvalue: options.params['targetvalue']
            };
            options.messages['requiredif'] = options.message;
        });
    //#endregion

    //#region Add red asterisks to required input's labels
    $('input[type=text]').each(function () {
        let req = $(this).attr('data-val-required');
        if (undefined != req) {
            let label = $('label[for="' + $(this).attr('id') + '"]');
            let text = label.text();
            if (text.length > 0) {
                label.addClass('required');
            }
        }
    });

    refreshRequiredIfAsterisks();
    //#endregion
}
//#endregion

//#region Functions
function linkTypeDropdownChanged(dropdown) {
    let allLinkTypes = document.querySelectorAll('.js-link-type');

    // Hide all link types
    allLinkTypes.forEach(element => { _hideElement(element); });

    if (dropdown.value !== linkTypeAnchorOrQueryStringOnly) {
        // Spread the NodeList into an array using [...]
        // Find the selected link type
        let selectedLinkType = [...allLinkTypes].find(element => element.dataset.linkTypeFor === dropdown.value);

        // Show the selected link type div
        _showElement(selectedLinkType);
    }

    enableOrDisableTestLink();
    refreshRequiredIfAsterisks();
}

function openUrlSelector() {
    let tabs = !_isFalseyOrWhitespace(modalDialogData.tabs) ? JSON.parse(modalDialogData.tabs) : ["page"];
    let defaultTab = !_isFalseyOrWhitespace(modalDialogData.defaultTab) ? modalDialogData.defaultTab : "page";
    let pageOptionsRootPath = !_isFalseyOrWhitespace(modalDialogData.pageRootPath) ? modalDialogData.pageRootPath : "/";
    let dialogOptions = {
        // https://docs.xperience.io/developing-websites/page-builder-development/selectors-for-page-builder-components/using-content-selector-javascript-api
        tabs: tabs,
        defaultTab: defaultTab,
        selectedItemsLimit: 1,
        pageOptions: {
            rootPath: pageOptionsRootPath,
            identifierMode: "guid"
        },
        applyCallback: function (data) {
            var dataItems = data.items;
            var dataType = data.type;

            if (dataItems && dataItems.length) {
                var dataItem = dataItems[0];

                // Checks if the content isn't already selected
                if (internalLinkUrlTextbox.value === dataItem.liveSiteUrl) {
                    return {
                        closeDialog: true
                    };
                }

                // If a page is selected then the Guid property is called 'nodeGuid', 
                // otherwise it's called 'fileGuid' (for media and attachments).
                internalLinkGuidTextbox.value = dataType === 'page' ? dataItem.nodeGuid : dataItem.fileGuid;
                internalLinkTypeTextbox.value = dataType;
                internalLinkUrlTextbox.value = dataItem.liveSiteUrl;

                enableOrDisableTestLink();

                return {
                    closeDialog: true
                };
            }
        }
    };

    // Populate media options depending on if they have been specified
    if (!_isFalseyOrWhitespace(modalDialogData.mediaLibraryName) || !_isFalseyOrWhitespace(modalDialogData.mediaAllowedExtensions)) {
        dialogOptions.mediaOptions = {};
        if (!_isFalseyOrWhitespace(modalDialogData.mediaLibraryName)) {
            dialogOptions.mediaOptions.libraryName = modalDialogData.mediaLibraryName;
        }
        if (!_isFalseyOrWhitespace(modalDialogData.mediaAllowedExtensions)) {
            dialogOptions.mediaOptions.allowedExtensions = modalDialogData.mediaAllowedExtensions;
        }
    }

    // Populate attachment options depending on if they have been specified
    if (!_isFalseyOrWhitespace(modalDialogData.attachmentAllowedExtensions)) {
        dialogOptions.attachmentOptions = {
            allowedExtensions: modalDialogData.attachmentAllowedExtensions
        };
    }

    // Preselect the item if content has been selected before
    if (!_isFalseyOrWhitespace(internalLinkUrlTextbox.value)) {
        dialogOptions.selectedItems = {
            type: internalLinkTypeTextbox.value.toLowerCase(),
            items: [{ value: internalLinkGuidTextbox.value }]
        };
    }
    window.kentico.modalDialog.contentSelector.open(dialogOptions);
}

function enableOrDisableTestLink() {
    let isValid = false;

    switch (linkTypeDropdown.value) {
        case linkTypeExternal:
            isValid = $(externalLinkUrlTextbox).valid();
            break;
        case linkTypeInternal:
            isValid = $(internalLinkUrlTextbox).valid();
            break;
        case linkTypeMailto:
            isValid = $(mailtoEmailAddressTextbox).valid();
            break;
        case linkTypePhoneNumber:
            isValid = $(phoneNumberTextbox).valid();
            break;
        case linkTypeAnchorOrQueryStringOnly:
            //isValid = $(anchorOrQueryStringTextbox).valid();
            // For the test link button to work with Anchor / query string only, the absolute URL
            // of the page that is being edited would need to be passed to testLink(). TODO.
            break;
    }

    isAnchorOrQueryStringValid = $(anchorOrQueryStringTextbox).valid();

    if (!_isFalseyOrWhitespace(anchorOrQueryStringTextbox.value) && linkTypeDropdown.value !== linkTypeAnchorOrQueryStringOnly && isValid) {
        isValid = isAnchorOrQueryStringValid;
    }

    if (isValid) {
        _enableElement(testLinkButton);
    } else {
        _disableElement(testLinkButton);
    }
}

function testLink() {
    let testLinkUrl;

    switch (linkTypeDropdown.value) {
        case linkTypeExternal:
            testLinkUrl = encodeURI(externalLinkUrlTextbox.value);
            break;
        case linkTypeInternal:
            testLinkUrl = encodeURI(internalLinkUrlTextbox.value);
            break;
        case linkTypeMailto:
            testLinkUrl = _getMailtoUrl();
            break;
        case linkTypePhoneNumber:
            testLinkUrl = _getTelUrl();
            break;
        case linkTypeAnchorOrQueryStringOnly:
            testLinkUrl = `/${anchorOrQueryStringTextbox.value}`;
            break;
    }

    if (linkTypeDropdown.value !== linkTypeAnchorOrQueryStringOnly) {
        testLinkUrl += `/${anchorOrQueryStringTextbox.value}`
    }

    try {
        var openTestLinkWindow = window.open(testLinkUrl);
    }
    catch (err) {
        alert(err.message);
    } finally {
        if (!openTestLinkWindow) {
            alert("The window was not allowed to open. Ensure your URL is valid.");
        }
    }
}

function getGeneralLink() {
    let generalLink = {
        linkText: linkTextTextbox.value,
        linkType: parseInt(linkTypeDropdown.value),
        openInNewTab: openInNewTabCheckbox.checked,
        customCssClassesTextbox: customCssClassesTextbox.value,
        anchorOrQueryString: anchorOrQueryStringTextbox.value
    };
    if (customCssClassesDropdown) {
        generalLink.customCssClasses = customCssClassesDropdown.value
            ? `${customCssClassesDropdown.value} ${customCssClassesTextbox.value}`
            : customCssClassesTextbox.value;
        generalLink.customCssClassesDropdown = customCssClassesDropdown.value;
    } else {
        generalLink.customCssClasses = customCssClassesTextbox.value
    }
    switch (linkTypeDropdown.value) {
        case linkTypeExternal:
            generalLink.link = {
                url: encodeURI(externalLinkUrlTextbox.value)
            };
            break;
        case linkTypeInternal:
            generalLink.link = {
                url: encodeURI(internalLinkUrlTextbox.value),
                internalReferenceGuid: internalLinkGuidTextbox.value,
                internalReferenceType: internalLinkTypeTextbox.value
            };
            break;
        case linkTypeMailto:
            generalLink.link = {
                url: _getMailtoUrl(),
                emailAddress: mailtoEmailAddressTextbox.value,
                emailCc: mailtoEmailCcTextbox.value,
                emailBcc: mailtoEmailBccTextbox.value,
                emailSubject: mailtoEmailSubjectTextbox.value,
                emailBody: mailtoEmailBodyTextbox.value
            };
            break;
        case linkTypePhoneNumber:
            generalLink.link = {
                url: _getTelUrl(),
                phoneNumber: phoneNumberTextbox.value
            };
            break;
        case linkTypeAnchorOrQueryStringOnly:
            generalLink.link = {
                url: `/${anchorOrQueryStringTextbox.value}`
            };
            break;
    }

    return generalLink;
}

function isGeneralLinkValid() {
    // Enable internal url textbox momentarily for jQuery validation
    _enableElement(internalLinkUrlTextbox);
    let isValid = $("form").valid();
    _disableElement(internalLinkUrlTextbox);
    return isValid;
}

function refreshRequiredIfAsterisks() {
    let linkType = linkTypeDropdown.value;

    $('input[type=text]').each(function () {
        let reqIf = $(this).attr('data-val-requiredif');
        if (undefined != reqIf) {
            let reqIfTargetValue = $(this).attr('data-val-requiredif-targetvalue');
            let label = $('label[for="' + $(this).attr('id') + '"]');
            if (undefined != reqIfTargetValue && reqIfTargetValue === linkType) {
                let text = label.text();
                if (text.length > 0) {
                    label.addClass('required');
                } else {
                    label.removeClass('required');
                }
            } else {
                label.removeClass('required');
            }
        }
    });
}
//#endregion

//#region Helpers
function _showElement(elementToShow) {
    if (elementToShow.classList.contains('hidden')) {
        elementToShow.classList.remove('hidden');
    }
}

function _hideElement(elementToHide) {
    if (!elementToHide.classList.contains('hidden')) {
        elementToHide.classList.add('hidden');
    }
}

function _enableElement(element) {
    if (element.hasAttribute('disabled')) {
        element.removeAttribute('disabled');
    }
}

function _disableElement(element) {
    if (!element.hasAttribute('disabled')) {
        element.setAttribute('disabled', '');
    }
}

function _isFalseyOrWhitespace(str) {
    return !str || !str.trim().length;
}

function _getMailtoUrl() {
    return encodeURI(`mailto:${mailtoEmailAddressTextbox.value}?cc=${mailtoEmailCcTextbox.value}`
        + `&bcc=${mailtoEmailBccTextbox.value}&subject=${mailtoEmailSubjectTextbox.value}`
        + `&body=${mailtoEmailBodyTextbox.value}`);
}

function _getTelUrl() {
    return encodeURI(`tel:${phoneNumberTextbox.value}`);
}
//#endregion