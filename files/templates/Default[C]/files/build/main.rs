//! This build script generates a JSON schema for the `Settings` struct.
//! The schema is used by the `config` crate to validate the configuration file.
//! The schema is written to `config/schema.json`.
macro_rules! p {
    ($($tokens: tt)*) => {
        println!("cargo:warning={}", format!($($tokens)*))
    }
}

/// This build script generates a JSON schema for the `Settings` struct.
/// The schema is used by the `config` crate to validate the configuration file.
/// The schema is written to `../../config/schema.json`.
/// The build script is re-run if `src/lib.rs` changes.
fn main() {
    p!("cargo:rerun-if-changed=src/lib.rs");
    let schema = schemars::schema_for!(Settings);
    let schema_file = Path::new("config/schema.json");
    fs::write(
        schema_file,
        serde_json::to_string_pretty(&schema).unwrap_or_else(|error| {
            p!("Error: {}", error);
            String::new()
        }),
    )
    .unwrap_or_else(|error| {
        p!("Error: {}", error);
    });

    p!("Writing JSON schema to {:?}", schema_file);
}

// include!("src/lib.rs");
use std::fs;
use std::path::Path;
use settings::Settings;