#!/usr/bin/env node
/**
 * Script to create domain layer directory structure
 * Run with: node docs/create-domain-structure.js
 */

const fs = require('fs');
const path = require('path');

const directories = [
  'domain/shared',
  'domain/ads',
  'tests/unit/domain',
];

directories.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('\n✅ Domain layer structure created successfully!');
console.log('\nNext steps:');
console.log('1. Domain layer files will be created in domain/shared/ and domain/ads/');
console.log('2. Unit tests will be in tests/unit/domain/');
