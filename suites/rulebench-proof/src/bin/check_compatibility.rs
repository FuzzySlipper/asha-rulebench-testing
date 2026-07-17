use std::fs;
use std::path::PathBuf;

use rulebench_bridge::{import_authored_content, BridgeScenario};
use rulebench_process_host::FileReplayArchiveStorage;
use rulebench_product_content::{
    aggregated_scenario_catalog_cases, compiled_ruleset_provider_catalog,
    hexing_bolt_fixture_scenario,
};
use rulebench_protocol::AuthoredContentPackDocumentDto;
use rulebench_replay::{ReplayArchiveStorage, REPLAY_ARCHIVE_PAYLOAD_ENCODING_VERSION};

const CONTENT_FIXTURES: [(&str, &str); 4] = [
    (
        "authored-content-v1",
        include_str!("../../../compatibility/fixtures/authored-content-v1.json"),
    ),
    (
        "authored-content-v2",
        include_str!("../../../compatibility/fixtures/authored-content-v2.json"),
    ),
    (
        "authored-content-v3",
        include_str!("../../../compatibility/fixtures/authored-content-v3.json"),
    ),
    (
        "authored-content-v4",
        include_str!("../../../compatibility/fixtures/shatterline-foundation-v4.json"),
    ),
];

const REPLAY_V1: &str = include_str!("../../../compatibility/fixtures/replay-storage-v1.json");

fn main() {
    for (name, payload) in CONTENT_FIXTURES {
        check_content(name, payload);
    }
    check_replay_v1();
    println!("compatibility matrix ok (4 authored-content versions; 1 replay-storage version)");
}

fn check_content(name: &str, payload: &str) {
    let document: AuthoredContentPackDocumentDto = serde_json::from_str(payload)
        .unwrap_or_else(|error| panic!("{name} strict decode failed: {error}"));
    let imported = import_authored_content(&document, &[], &compiled_ruleset_provider_catalog())
        .unwrap_or_else(|error| {
            panic!(
                "{name} public import failed with {}: {}",
                error.code, error.message
            )
        });
    println!(
        "compatibility {name} v{} accepted {}@{}",
        document.format_version, imported.pack.identity.id, imported.pack.identity.version
    );
}

fn check_replay_v1() {
    let directory = temporary_directory();
    fs::create_dir_all(&directory).expect("replay compatibility directory creates");
    let path = directory.join(format!("{}.replay.json", hex_name("hexing-bolt-replay")));
    fs::write(&path, REPLAY_V1).expect("testing-owned v1 replay fixture copies");

    let base = hexing_bolt_fixture_scenario();
    let mut scenarios = vec![BridgeScenario::new(
        base.metadata.id.clone(),
        base.metadata.title.clone(),
        base.metadata.summary.clone(),
        base,
    )];
    scenarios.extend(aggregated_scenario_catalog_cases().into_iter().map(|case| {
        BridgeScenario::new(
            case.summary.id,
            case.summary.title,
            case.summary.summary,
            case.scenario,
        )
    }));
    let report = FileReplayArchiveStorage::open(&directory, scenarios)
        .expect("v1 replay repository opens through public host API");
    assert!(
        report.issues.is_empty(),
        "v1 replay issues: {:?}",
        report.issues
    );
    let entry = report
        .storage
        .read("hexing-bolt-replay")
        .expect("v1 replay reads")
        .expect("v1 replay is visible");
    assert_eq!(entry.package.package_version, "1.0.0");
    assert_eq!(
        entry.payload_encoding_version,
        REPLAY_ARCHIVE_PAYLOAD_ENCODING_VERSION
    );
    drop(report);
    let migrated: serde_json::Value =
        serde_json::from_slice(&fs::read(&path).expect("migrated replay remains readable"))
            .expect("migrated replay remains JSON");
    assert_eq!(migrated["formatVersion"], 2);
    fs::remove_dir_all(&directory).expect("replay compatibility directory removes");
    println!("compatibility replay-storage-v1 accepted and migrated");
}

fn hex_name(value: &str) -> String {
    value
        .as_bytes()
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn temporary_directory() -> PathBuf {
    std::env::temp_dir().join(format!(
        "asha-rulebench-testing-replay-v1-{}",
        std::process::id()
    ))
}
