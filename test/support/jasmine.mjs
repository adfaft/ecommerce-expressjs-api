export default {
  spec_dir: "test",
  spec_files: [
    "**/*[sS]pec.?(m)js",
    "**/*test.?(m)js"
  ],
  helpers: [
    "helpers/babel.js",
    "helpers/**/*.?(m)js"
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true
  }
}
