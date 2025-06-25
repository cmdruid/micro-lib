#!/bin/bash

# Usage: ./scripts/release.sh [--delete]
# --delete: Delete existing tag and release instead of creating new one
# If no --delete flag is provided, it will create/publish a release using version from package.json

# Parse command line arguments
DELETE_MODE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --delete)
            DELETE_MODE=true
            shift
            ;;
        *)
            echo "❌ Unknown option: $1"
            echo "Usage: ./scripts/release.sh [--delete]"
            exit 1
            ;;
    esac
done

# Check if required tools are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "   Please install Node.js to read package.json"
    exit 1
fi

# Check if we're in a git repository with origin remote
if ! git rev-parse --git-dir &> /dev/null; then
    echo "❌ Not in a git repository"
    echo "   Make sure you're in a git repository"
    exit 1
fi

if ! git remote get-url origin &> /dev/null; then
    echo "❌ No 'origin' remote found"
    echo "   Make sure you have an 'origin' remote configured"
    exit 1
fi

# Function to get version from package.json
get_package_version() {
    node -p "require('./package.json').version"
}

# Function to check if tag exists remotely
check_tag_exists() {
    local tag=$1
    
    # Check if tag exists on remote
    if git ls-remote --tags origin | grep -q "refs/tags/$tag$"; then
        return 0  # Tag exists
    else
        return 1  # Tag doesn't exist
    fi
}

# Function to delete tag and release
delete_tag_and_release() {
    local tag=$1
    
    echo "🗑️  Deleting tag and release for: $tag"
    
    # Check if tag exists remotely first
    if ! check_tag_exists "$tag"; then
        echo "❌ Tag $tag does not exist on remote"
        exit 1
    fi
    
    # Delete local tag if it exists
    if git tag -l | grep -q "^$tag$"; then
        echo "🏷️  Deleting local tag: $tag"
        git tag -d "$tag"
        if [ $? -ne 0 ]; then
            echo "❌ Failed to delete local tag"
            exit 1
        fi
    fi
    
    # Delete remote tag
    echo "🌐 Deleting remote tag: $tag"
    git push origin --delete "$tag"
    if [ $? -ne 0 ]; then
        echo "❌ Failed to delete remote tag"
        exit 1
    fi
    
    echo "✅ Successfully deleted tag: $tag"
    echo "ℹ️  Note: If there was a GitHub release associated with this tag,"
    echo "   it may need to be manually deleted from the GitHub releases page"
}

VERSION=$(get_package_version)

if [ -z "$VERSION" ]; then
   echo "❌ Failed to read version from package.json"
   exit 1
fi

echo "📦 Using version from package.json: $VERSION"

TAG="v$VERSION"

if [ "$DELETE_MODE" = true ]; then
    # Delete mode: remove existing tag and release
    delete_tag_and_release "$TAG"
else
    # Normal mode: create and publish release
    
    # Check if tag already exists remotely
    echo "🔍 Checking if tag $TAG already exists on remote..."
    if check_tag_exists "$TAG"; then
        echo "❌ Tag $TAG already exists on remote!"
        echo "   Use --delete flag to remove existing tag first"
        exit 1
    fi

    echo "✅ No existing tag found for $TAG"
    echo "🏷️  Creating and pushing tag: $TAG"

    # Create and push tag
    git tag "$TAG" && git push origin "$TAG"

    if [ $? -eq 0 ]; then
        echo "✅ Successfully created and pushed tag: $TAG"
        echo "🚀 GitHub Action should now be running for the release"
    else
        echo "❌ Failed to create/push tag"
        exit 1
    fi
fi 