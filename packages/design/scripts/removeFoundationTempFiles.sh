remove_foundation_temp_files() {
  mv $1.d.ts.temp $1.d.ts && mv $1.js.temp $1.js
}

remove_foundation_temp_files "foundation"
remove_foundation_temp_files "foundation.ios"
remove_foundation_temp_files "foundation.android"
remove_foundation_temp_files "foundation.native"
