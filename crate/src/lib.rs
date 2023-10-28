use json;
use mail_parser::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn eml_to_json(data: &[u8]) -> String {
    let message = MessageParser::default().parse(data).unwrap();

    let to: Vec<_> = message
        .to()
        .unwrap()
        .iter()
        .map(|x| x.address().unwrap())
        .collect();
    let from: Vec<_> = message
        .from()
        .unwrap()
        .iter()
        .map(|x| x.address().unwrap())
        .collect();
    let subject = message.subject().unwrap();
    let attachment_count = message.attachment_count();
    let body = message.body_text(0).unwrap();
    let body_html = message.body_html(0).unwrap();
    let date = message.date().unwrap().to_rfc3339();

    let mut json_obj = json::JsonValue::new_object();

    json_obj["date"] = date.into();
    json_obj["to"] = to.into();
    json_obj["from"] = from.into();
    json_obj["subject"] = subject.into();
    json_obj["attachment_count"] = attachment_count.into();
    json_obj["body"] = body.to_string().into();
    json_obj["body_html"] = body_html.to_string().into();

    return json_obj.to_string();
}
