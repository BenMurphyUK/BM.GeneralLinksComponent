function onDragStart(event) {
    event.currentTarget.classList.add('dragging');
}

function onDragEnd(event, dialogData) {
    event.currentTarget.classList.remove('dragging');
    updateComponentValue(dialogData);
}

function onDragOver(event) {
    const dragging = document.querySelector('.dragging');
    if (event.currentTarget.dataset.allGeneralLinksFor === dragging.dataset.allGeneralLinksFor) {
        event.preventDefault();
        const afterElement = getDragAfterElement(event.currentTarget, event.clientY);
        if (afterElement == null) {
            if (!event.currentTarget.lastElementChild.classList.contains('general-link-empty')) {
                event.currentTarget.appendChild(dragging);
            }
        } else {
            event.currentTarget.insertBefore(dragging, afterElement);
        }
    }
}

function getDragAfterElement(container, mouseYPosition) {
    const draggableElements = [...container.querySelectorAll('.js-general-link:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = mouseYPosition - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return {
                offset: offset,
                element: child
            };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function addGeneralLink(generalLinkWrapperElement, dialogData) {
    let modalDialogData = JSON.parse(JSON.stringify(dialogData));
    modalDialogData.title = 'Add link';
    openGeneralLinkModalDialog(modalDialogData, generalLinkWrapperElement);
}

function openGeneralLinkModalDialog(modalDialogData, generalLinkWrapperElement) {
    kentico.modalDialog.open({
        url: modalDialogData.modalDialogUrl,
        applyCallback: function (dialogWindow) {
            if (!dialogWindow.isGeneralLinkValid()) {
                return { closeDialog: false };
            }

            handleGeneralLinkReturned(dialogWindow.getGeneralLink(), generalLinkWrapperElement, modalDialogData);
            return { closeDialog: true };
        },
        applyButtonText: 'Save',
        cancelButtonText: 'Cancel',
        title: modalDialogData.title,
        width: '640px',
        data: modalDialogData
    });
}

function handleGeneralLinkReturned(generalLinkObj, generalLinkWrapperElement, dialogData) {
    // We check to see if a link preview textbox already exists, and if it does
    // then the code in the if statement has already been run before.
    if (!generalLinkWrapperElement.querySelector('.js-link-preview-textbox')) {
        generalLinkWrapperElement.classList.remove('general-link-empty');
        generalLinkWrapperElement.setAttribute('draggable', 'true');
        generalLinkWrapperElement.setAttribute('ondragstart', 'onDragStart(event)');
        generalLinkWrapperElement.setAttribute('ondragend', `onDragEnd(event, ${JSON.stringify(dialogData)})`);
        generalLinkWrapperElement.setAttribute('data-all-general-links-for', dialogData.generalLinksIdentifier);

        let linkPreviewTextbox = document.createElement('input');
        linkPreviewTextbox.classList.add('ktc-form-control');
        linkPreviewTextbox.classList.add('js-link-preview-textbox');
        linkPreviewTextbox.classList.add('link-preview-textbox');
        linkPreviewTextbox.setAttribute('readonly', '');
        linkPreviewTextbox.value = generalLinkObj.linkText;
        generalLinkWrapperElement.prepend(linkPreviewTextbox);

        let generalLinkAddButton = generalLinkWrapperElement.querySelector('.js-general-link-add');
        generalLinkAddButton.innerHTML = '&#9998;';
        generalLinkAddButton.classList.add('general-link-control-button');
        generalLinkAddButton.classList.remove('js-general-link-add');
        generalLinkAddButton.setAttribute('onclick', `editGeneralLink(this.parentElement, ${JSON.stringify(dialogData)})`);

        let deleteGeneralLinkButton = document.createElement('button');
        deleteGeneralLinkButton.innerHTML = '&#10006;';
        deleteGeneralLinkButton.classList.add('general-link-control-button');
        deleteGeneralLinkButton.classList.add('ktc-btn');
        deleteGeneralLinkButton.classList.add('delete-button');
        deleteGeneralLinkButton.setAttribute('onclick', `deleteGeneralLink(this.parentElement, ${JSON.stringify(dialogData)})`);
        generalLinkWrapperElement.appendChild(deleteGeneralLinkButton);
    } else {
        let existingLinkPreviewTextbox = generalLinkWrapperElement.querySelector('.js-link-preview-textbox');
        existingLinkPreviewTextbox.value = generalLinkObj.linkText;
    }

    let generalLinkValueTextbox = generalLinkWrapperElement.querySelector('.js-general-link-value');
    generalLinkValueTextbox.value = JSON.stringify(generalLinkObj);

    updateComponentValue(dialogData);
    tryAddGeneralLinkMarkup(dialogData);
}

function editGeneralLink(generalLinkWrapperElement, dialogData) {
    let modalDialogData = JSON.parse(JSON.stringify(dialogData));
    modalDialogData.existingLink = JSON.parse(generalLinkWrapperElement.querySelector('.js-general-link-value').value);
    modalDialogData.title = 'Edit link';

    openGeneralLinkModalDialog(modalDialogData, generalLinkWrapperElement);

    updateComponentValue(dialogData);
}

function deleteGeneralLink(generalLinkWrapperElement, dialogData) {
    generalLinkWrapperElement.remove();
    updateComponentValue(dialogData);

    let allGeneralLinksDiv = document.querySelector(`.js-all-general-links[data-all-general-links-for="${dialogData.generalLinksIdentifier}"]`);
    let currentNumberAddButtons = allGeneralLinksDiv.querySelectorAll('.js-general-link-add').length;
    if (currentNumberAddButtons < 1) {
        tryAddGeneralLinkMarkup(dialogData);
    }
}

function tryAddGeneralLinkMarkup(dialogData) {
    let allGeneralLinksDiv = document.querySelector(`.js-all-general-links[data-all-general-links-for="${dialogData.generalLinksIdentifier}"]`);

    let currentNumberOfGeneralLinks = allGeneralLinksDiv.querySelectorAll('.js-general-link').length;

    if (currentNumberOfGeneralLinks < dialogData.maxLinks) {
        let generalLinkWrapper = document.createElement('div');
        generalLinkWrapper.classList.add('js-general-link');
        generalLinkWrapper.classList.add('general-link');
        generalLinkWrapper.classList.add('general-link-empty');

        let newGeneralLinkHiddenInput = document.createElement('input');
        newGeneralLinkHiddenInput.setAttribute('type', 'hidden');
        newGeneralLinkHiddenInput.classList.add('js-general-link-value');

        let newGeneralLinkAddButton = document.createElement('button');
        newGeneralLinkAddButton.setAttribute('type', 'button');
        newGeneralLinkAddButton.setAttribute('onclick', `addGeneralLink(this.parentElement, ${JSON.stringify(dialogData)})`);
        newGeneralLinkAddButton.classList.add('js-general-link-add');
        newGeneralLinkAddButton.classList.add('ktc-btn');
        newGeneralLinkAddButton.classList.add('ktc-btn-default');
        newGeneralLinkAddButton.innerHTML = 'Add';

        generalLinkWrapper.appendChild(newGeneralLinkAddButton);
        generalLinkWrapper.appendChild(newGeneralLinkHiddenInput);
        allGeneralLinksDiv.appendChild(generalLinkWrapper);
    }
}

function updateComponentValue(dialogData) {
    let componentValueTextbox = document.getElementById(dialogData.componentValueTextboxId);

    componentValueTextbox.value = '';

    let allGeneralLinks = [];
    let allGeneralLinksDiv = document.querySelector(`.js-all-general-links[data-all-general-links-for="${dialogData.generalLinksIdentifier}"]`);
    let allGeneralLinkValueTextboxes = allGeneralLinksDiv.querySelectorAll('.js-general-link-value');

    [...allGeneralLinkValueTextboxes].forEach(function (generalLinkValueTextbox) {
        if (generalLinkValueTextbox.value) {
            allGeneralLinks.push(JSON.parse(generalLinkValueTextbox.value));
        }
    });

    if (allGeneralLinks.length > 0) {
        componentValueTextbox.value = JSON.stringify(allGeneralLinks);
    }
}