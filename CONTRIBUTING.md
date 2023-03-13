# Contributing

## Building the site

The documentation uses [jekyll](https://jekyllrb.com/), a Ruby based static site generator, with [Just the Docs](https://github.com/just-the-docs/just-the-docs). You will need to set up Ruby locally to run the server and see your changes.

``` bash
gem install bundler
bundle install
```

With all the gems (dependencies) installed, you can launch the jekyll server.

``` bash
bundle exec jekyll serve
```

It will show output like this, and you can grab the Server address and open it in your browser.

```
Configuration file: /Users/phil/src/OAI/Documentation/_config.yml
            Source: /Users/phil/src/OAI/Documentation
       Destination: /Users/phil/src/OAI/Documentation/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 0.018 seconds.
 Auto-regeneration: enabled for '/Users/phil/src/OAI/Documentation'
    Server address: http://127.0.0.1:4000/Documentation/
```

Alternatively, you can use the following Docker command to build and serve the documentation:

```shell
docker build . -t oas-doc/latest
docker run -v $(pwd):/site -p 4000:4000 oas-doc/latest
```

### Regenerating the images

This can be done with the `dot` tool from the `graphviz` package.
