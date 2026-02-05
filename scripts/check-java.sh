#!/usr/bin/env sh

echo "🔍 Running Java formatting and linting..."

# Check if this is a Gradle project
if [ ! -f "build.gradle" ] && [ ! -f "build.gradle.kts" ]; then
    echo "⏭️  No Gradle build file found, skipping Java checks"
    exit 0
fi

# Check if any Java files are being committed
java_files=$(git diff --cached --name-only --diff-filter=ACM | grep '\.java$')
if [ -z "$java_files" ]; then
    echo "⏭️  No Java files in commit, skipping Java checks"
    exit 0
fi

echo "📝 Java files to check:"
echo "$java_files"

# Run Spotless apply to auto-fix issues
echo "🔧 Running Gradle Spotless apply..."
./gradlew spotlessApply

# Check if any files were modified by spotless
if ! git diff --quiet; then
    echo ""
    echo "⚠️  Java code was automatically formatted!"
    echo "📋 Modified files:"
    git diff --name-only | grep '\.java$'
    echo ""
    echo "🔄 Please review the changes and run:"
    echo "   git add ."
    echo "   git commit"
    echo ""
    exit 1
fi

# Final verification that everything is properly formatted
echo "✅ Running final Spotless check..."
./gradlew spotlessCheck

if [ $? -eq 0 ]; then
    echo "✅ Java formatting and linting passed!"
else
    echo "❌ Spotless check failed"
    exit 1
fi
