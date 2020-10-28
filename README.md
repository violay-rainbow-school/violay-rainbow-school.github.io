# Site web statique

## Installation

1. Installer Ruby :

    ```bash
    sudo apt-get install ruby-full build-essential zlib1g-dev
    echo '# Install Ruby Gems to ~/gems' >> ~/.bashrc
    echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
    echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
    source ~/.bashrc
    ```

1. Installer Jekyll :

    ```bash
    gem install jekyll bundler
    ```

1. Récupérer le code source du site :

    ```bash
    git clone adresseRepositoryGithub
    ```

1. Dans le dossier du site :

    ```bash
    bundle install
    ```

## Utilisation

En local :

```bash
bundle exec jekyll serve
```

## Configuration

Fichier `/_config.yml` :
- Adresse du site :

    ```yaml
    baseurl: https://violay-rainbow-school.github.io/
    ```

## Memoirs Jekyll Theme

[Live Demo](https://wowthemesnet.github.io/jekyll-theme-memoirs/) | [Docs & Download](https://bootstrapstarter.com/bootstrap-templates/jekyll-theme-memoirs/) |  [Buy me a coffee](https://www.wowthemes.net/donate/)
