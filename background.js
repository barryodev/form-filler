chrome.action.onClicked.addListener(async function(tab) {
    let full_doc, input_field, box_model, input_field_x, input_field_y
    
    await chrome.debugger.attach({ tabId: tab.id }, "1.3")


    full_doc = await chrome.debugger.sendCommand({ tabId: tab.id }, "DOM.getDocument", {
        depth: -1
    })
    console.log('Got full doc node id: ' + full_doc.root.nodeId);

    input_field = await chrome.debugger.sendCommand({tabId: tab.id }, "DOM.querySelector", {
        nodeId: full_doc.root.nodeId,
        selector: 'input[name="lastName"]'
    })

    console.log('Got node id of input field: ' + input_field);

    box_model = await chrome.debugger.sendCommand({tabId: tab.id }, "DOM.getBoxModel", {
        nodeId: input_field.nodeId
    })

    input_field_x = box_model.model.content[0] + 20
    input_field_y = box_model.model.content[1] + 20

    console.log('Box model of input field: ' + box_model.model.content);

    await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: input_field_x,
        y: input_field_y,
        button: "left"
    })

    await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: input_field_x,
        y: input_field_y,
        button: "left"
    })

    await chrome.debugger.sendCommand({ tabId: tab.id }, "Input.dispatchKeyEvent", {
        type: "char",
        text: "A",
        modifiers: 0
    })

    await chrome.debugger.detach({ tabId: tab.id })

});