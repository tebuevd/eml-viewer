use json;
use json::object;
use json::JsonValue;
use mail_parser::Address;
use mail_parser::HeaderValue;
use mail_parser::*;
use wasm_bindgen::prelude::*;

fn addresses_to_json(addrs: Option<&Address>) -> JsonValue {
    return match addrs {
        None => JsonValue::new_array(),
        Some(addrs) => {
            return addrs
                .iter()
                .map(|item| {
                    let mut obj = JsonValue::new_object();
                    obj["name"] = item.name().into();
                    obj["address"] = item.address().into();
                    return obj;
                })
                .collect::<Vec<_>>()
                .into()
        }
    };
}

#[wasm_bindgen]
pub fn eml_to_json(data: &[u8]) -> String {
    let message = MessageParser::default().parse(data).unwrap();

    let attachment_count = message.attachment_count();
    let body = message.body_text(0).unwrap();
    let body_html = message.body_html(0).unwrap();

    let mut headers_arr = JsonValue::new_array();

    for header in message.headers() {
        match &header.value {
            HeaderValue::ContentType(value) => {
                let header_blob = object! {
                    name: header.name(),
                    value: object! {
                        type: value.c_type.as_ref(),
                        subtype: match value.c_subtype {
                            Some(ref subtype) => subtype.as_ref(),
                            None => ""
                        },
                    }
                };

                headers_arr.push(header_blob).unwrap();
            }
            HeaderValue::Text(value) => {
                let header_blob = object! {
                    name: header.name(),
                    value: value.as_ref()
                };

                headers_arr.push(header_blob).unwrap();
            }
            _ => {}
        }
    }

    let mut json_obj = JsonValue::new_object();

    json_obj["from"] = addresses_to_json(message.from());
    json_obj["to"] = addresses_to_json(message.to());

    json_obj["subject"] = match message.subject() {
        Some(subject) => subject.into(),
        None => JsonValue::Null,
    };

    json_obj["date"] = match message.date() {
        Some(date) => date.to_rfc3339().into(),
        None => JsonValue::Null,
    };

    json_obj["attachment_count"] = attachment_count.into();
    json_obj["body"] = body.to_string().into();
    json_obj["body_html"] = body_html.to_string().into();
    json_obj["raw_headers"] = headers_arr;

    return json_obj.to_string();
}
