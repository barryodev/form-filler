async function simulate_mouse_click(tab, target_x, target_y){
    await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: target_x,
        y: target_y,
        button: "left"
    })

    await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: target_x,
        y: target_y,
        button: "left"
    })
}

async function clickElement(tab, selector) {
    let full_doc, input_field, box_model, input_field_x, input_field_y

    full_doc = await chrome.debugger.sendCommand({ tabId: tab.id }, "DOM.getDocument", {
        depth: -1
    })

    input_field = await chrome.debugger.sendCommand({tabId: tab.id }, "DOM.querySelector", {
        nodeId: full_doc.root.nodeId,
        selector: selector
    })

    box_model = await chrome.debugger.sendCommand({tabId: tab.id }, "DOM.getBoxModel", {
        nodeId: input_field.nodeId
    })

    input_field_x = box_model.model.content[0] + 20
    input_field_y = box_model.model.content[1] + 20

    simulate_mouse_click(tab, input_field_x, input_field_y)
}

async function typeString(tab, wordToType) {
    for (var i = 0; i < wordToType.length; i++) {
        await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchKeyEvent", {
            type: "char",
            text: wordToType[i],
            modifiers: 0
        })
      }
}


chrome.action.onClicked.addListener(async function(tab) {
    
    await chrome.debugger.attach({ tabId: tab.id }, "1.3")

    await clickElement(tab, 'input[name="lastName"]')

    await typeString(tab, "ODev")

    await clickElement(tab, 'input[name="firstName"]')

    await typeString(tab, "Barry")

    await clickElement(tab, 'input[name="middleName"]')

    await typeString(tab, "middle")

    await clickElement(tab, 'input[name="phoneNumber"]')

    await typeString(tab, "+353871112222")

    await clickElement(tab, 'input[name="email"]')

    await typeString(tab, "fake@gmail.com")

    await clickElement(tab, 'input[name="re_email"]')

    await typeString(tab, "fake@gmail.com")

    await new Promise(r => setTimeout(r, 500));

    await simulate_mouse_click(tab, 5, 5)

    await chrome.debugger.detach({ tabId: tab.id })

});
