/**
 * TabAccordion – An accordion, that may change its display to tabbed content based on the screen width.
 *
 * @author    Thomas Heuer <thomas.heuer@votum.de>
 * @copyright Copyright (c) 2014 Votum GmbH
 *
 * Some nice extra ideas:
 * @todo Measure & set tab content heights individually and remove parent min-height to avoid gaps below tabbed-content
 * @todo Open a section, that was selected through an URL anchor
 * @todo Make all class names configurable from outside of the module scope
 */
define( ['media-query-sync', 'functions'], function( MediaQuerySync, Functions ) {

    /**
     * Display constants; do not edit these – they are only used inside this module and are hardcoded below.
     * @type {Object}
     */
    var display = {
        none: 0,
        accordion: 1,
        tabs: 2
    };

    /**
     * Configuration; may get overwritten through init-method.
     *
     * @type {Object}
     */
    var defaultConfig = {

        /* The selector entries must contain valid CSS selectors to be used in querySelector() */
        selector: {

            /* A CSS selector to identify an area that should be used as accordion/tabbed content. */
            wrapper: '[data-tabaccordion]',

            /* This is a single part/section of the accordion/tabbed content.
             * It must be within `selector.wrapper` */
            section: 'section',

            /* This is the section header – the part which to click on to open a section.
             * It must be within `selector.section` */
            sectionHeading: ':scope > header',

            /* This is a selector to find section contents; you may also set a specific body wrapper here.
             * It must be within `selector.section` */
            sectionBody: ':scope > *:not(header)'
        },

        /* This class name will be added to a new element that is inserted around the section body elements */
        sectionBodyWrapperClass: 'tabaccordion-body-wrapper',

        /* A class name to designate opened sections */
        showSectionClass: 'open',

        /* A class name that is set on the `selector.wrapper` depending on the state of the tabaccordion.
         * These class names should be used to style a specific state/layout.
         * They must be defined here without the leading dot. */
        wrapperTypeClass: {
            accordion: 'accordion',
            tabs: 'tabbed-content'
        },

        /* Specify a class name prefix for a class that indicates the count of child elements in this tabaccordion;
         * Set to an falsy value, if the class should get set */
        wrapperSectionCountClassPrefix: 'tabaccordion-section-count-',

        /**
         * The tabaccordion-types, that define how to display a group of sections on a
         * specified media query breakpoint.
         *
         * New types may be created here according to the pattern below, where:
         * - "type" is a chosen identifier to be set in the data-attribute
         * - "breakpoint" is one of the breakpoints defined in the MediaQuerySync module
         * - "display" is one of the `display` display constants
         *
         * Make sure the breakpoints for each type do not overlap. (e.g. 'md' must only occur once per type)
         *
         * @type {Object} { type: { breakpoint: display } }
         */
        types: {
            'accordion': {
                sm: display.accordion,
                md: display.accordion,
                lg: display.accordion,
                xl: display.accordion,
                xxl: display.accordion
            },
            'accordion-tabs': {
                sm: display.accordion,
                md: display.accordion,
                lg: display.tabs,
                xl: display.tabs,
                xxl: display.tabs
            },
            'accordion-mobile-only': {
                sm: display.accordion,
                md: display.accordion,
                lg: display.none,
                xl: display.none,
                xxl: display.none
            },
            'tabs-only': {
                sm: display.tabs,
                md: display.tabs,
                lg: display.tabs,
                xl: display.tabs,
                xxl: display.tabs
            }
        },

        /**
         * Set the default type.
         * Attention: There is no check if the given key really exists.
         *
         * @type {string} One of the keys of the `types` array.
         */
        defaultType: 'accordion-tabs',

        /* Auto play configuration */
        autoPlay: {
            enabled: false,

            /* How long an item should be visible */
            delay: 4000,

            /* Start over, when the last item was reached? */
            loop: true,

            /* Stop, if the user moves the mouse over the element */
            stopOnHover: true,

            /* Set, which element must be hovered to stop the autoplay;
             * By default this is config.selector.wrapper */
            stopOnHoverSelector: null
        },

        /* callback function on accordion ready */
        onAccordionReady: null

    };

    /**
     * The Accordion object
     *
     * @param {Element} wrapper The wrapper element around the tab-accordion (which already must exist).
     * @param {NodeList} sections The single sections/item of an accordion.
     * @param {String} type One of the keys of the `types` array.
     * @param {Object} userConfig An object with all configuration parameters.
     * @constructor
     */
    function Accordion( wrapper, sections, type, userConfig ) {

        if( !(wrapper instanceof Element) ) {
            throw new Error( 'Accordion: The parameter `wrapper` must be of type Element but was of type `' + (typeof wrapper) + '`.' );
        }
        if( !(sections instanceof NodeList) ) {
            throw new Error( 'Accordion: The parameter `sections` must be of type NodeList but was of type `' + (typeof sections) + '`.' );
        }

        this.config = userConfig;
        this.wrapper = wrapper;
        this.sections = sections;
        /* Get the selected type or the default fallback. */
        this.type = this.config.types[type] ? this.config.types[type] : this.config.types[this.config.defaultType];
        this.length = sections.length;
        this.activeSection = 0;
        this.currentDisplay = display.none;

        /* Get a named reference to this object for usage in event handlers */
        var currentAccordion = this;

        /* Initial setup… */
        var heading, body, thisBodyWrapper;

        /* Add number of sections to the wrapper */
        if( this.config.wrapperSectionCountClassPrefix ) {
            this.wrapper.classList.add( this.config.wrapperSectionCountClassPrefix + this.length );
        }

        /* Only create the wrapper element once and copy it as necessary (see below) */
        var bodyWrapper = document.createElement( 'div' );
        bodyWrapper.className = this.config.sectionBodyWrapperClass;

        /* Iterate over sections */
        for( var i = this.length; i--; ) {

            /* Cache necessary elements */
            heading = currentAccordion.sections[i].querySelector( this.config.selector.sectionHeading );
            body = currentAccordion.sections[i].querySelectorAll( this.config.selector.sectionBody );

            /* Make a copy of the body-wrapper element and wrap the body in it */
            thisBodyWrapper = bodyWrapper.cloneNode( false );

            for( var k = 0, len = body.length; k < len; k++ ) {
                thisBodyWrapper.appendChild( body[k] );
            }

            currentAccordion.sections[i].appendChild( thisBodyWrapper );

            /* Setup event handler;
             * The inner function scope is necessary because of the counter, which would be 0 for all events otherwise */
            heading.addEventListener( 'click', (function() {
                var currentSection = currentAccordion.sections[i];
                return function( event ) {
                    if( currentAccordion.currentDisplay === display.accordion && currentSection.classList.contains( currentAccordion.config.showSectionClass ) ) {
                        /* Close this section if was open already */
                        currentAccordion.close( currentSection );
                    }
                    else {
                        /* Or open it, if it was not */
                        currentAccordion.open( currentSection );
                    }
                };
            })() );

        }

        /* Set computed heights as inline styles */
        this.setComputedHeights();

        window.addEventListener( 'resize', Functions.debounce( function( event ) {
            currentAccordion.setComputedHeights();
        }, 100 ), false );

        /* Initially set type according to current device state (media query breakpoint) */
        this.updateType( MediaQuerySync.getDeviceState() );

        /* Change the type as necessary when another breakpoint was reached */
        window.addEventListener( 'deviceStateChanged', function( event ) {
            currentAccordion.updateType( event.deviceState );
        }, false );
    }

    /**
     * Iterate over each section to read its real height (the one without a height/max-height value).
     * This computed height is then set as `max-height`.
     */
    Accordion.prototype.setComputedHeights = function() {
        var bodyWrapper, maxHeight = 0, currentMaxHeight, heading;

        /* Remove any styles */
        var classNameTmp = this.wrapper.className;
        //this.wrapper.className = '';
        this.wrapper.classList.remove( this.config.wrapperTypeClass.accordion );
        this.wrapper.classList.remove( this.config.wrapperTypeClass.tabs );

        for( var i = this.length; i--; ) {
            bodyWrapper = this.sections[i].querySelector( '.' + this.config.sectionBodyWrapperClass );

            /* Fall back to no max-height */
            bodyWrapper.style.maxHeight = 'none';

            currentMaxHeight = bodyWrapper.offsetHeight;

            /* Store the biggest height of all sections */
            if( currentMaxHeight > maxHeight ) {
                maxHeight = currentMaxHeight;
            }

            /* Set new max-height and account for the bottom border */
            bodyWrapper.style.maxHeight = (currentMaxHeight + 2) + 'px';
        }

        /* Get example heading height and add it to the overall height */
        heading = this.sections[0].querySelector( this.config.selector.sectionHeading );
        this.wrapper.style.minHeight = maxHeight + 'px';

        /* set original class name */
        this.wrapper.className = classNameTmp;
    };

    /**
     * @param {String} deviceState One of [xs, sm, md, lg]
     */
    Accordion.prototype.updateType = function( deviceState ) {
        if( !this.type[deviceState] ) {
            return;
        }

        this.currentDisplay = this.type[deviceState];

        /* switch to type */
        switch( this.type[deviceState] ) {
            case display.none:
                this.removeTabAccordion();
                break;
            case display.tabs:
                this.makeTabs();
                break;
            case display.accordion:
            default:
                this.makeAccordion();
        }
    };

    /**
     * Open a specific section
     *
     * @param {Element|Number} section
     */
    Accordion.prototype.open = function( section ) {

        /* get a single section from numeric index */
        if( !(section instanceof Element) ) {
            section = this.sections.item( parseInt( section, 10 ) );
        }

        /* close the last section */
        this.close( this.activeSection );

        /* open section */
        section.classList.add( this.config.showSectionClass );

        /* set this section as current */
        this.activeSection = section;
    };

    /**
     * Close all sections or a specific one
     *
     * @param {Element|Number|undefined} section
     */
    Accordion.prototype.close = function( section ) {

        /* close all sections without parameter */
        if( typeof section === 'undefined' ) {
            for( var i = this.length; i--; ) {
                this.close( this.sections[i] );
            }
            return;
        }

        /* get a single section from numeric index */
        if( !(section instanceof Element) ) {
            section = this.sections.item( parseInt( section, 10 ) );
        }

        /* close section */
        section.classList.remove( this.config.showSectionClass );
    };

    /**
     * Remove any classes, switch back to normal panels
     */
    Accordion.prototype.removeTabAccordion = function() {
        this.wrapper.classList.remove( this.config.wrapperTypeClass.tabs );
        this.wrapper.classList.remove( this.config.wrapperTypeClass.accordion );
    };

    /**
     * Turn the current section group into an accordion
     */
    Accordion.prototype.makeAccordion = function() {
        this.wrapper.classList.remove( this.config.wrapperTypeClass.tabs );
        this.wrapper.classList.add( this.config.wrapperTypeClass.accordion );
    };

    /**
     * Turn the current section group into tabbed content
     */
    Accordion.prototype.makeTabs = function() {
        this.wrapper.classList.add( this.config.wrapperTypeClass.tabs );
        this.wrapper.classList.remove( this.config.wrapperTypeClass.accordion );
        this.open( 0 );

        /* run callback onAccordionReady function here */
        if( this.config.onAccordionReady != null ) {
            var _this = this;
            setTimeout( function() {
                _this.config.onAccordionReady();
            }, 100 );
        }
    };

    var module = {
        /**
         * Expose the Accordion object to the parent scope.
         * This can be used to manually create a new accordion instance.
         */
        Accordion: Accordion,

        /**
         * Helper function to set up the dynamic accordions.
         *
         * @param {Object} classNames Custom overwrites for the class names as in the `classes` object.
         * @returns {Array} A list of Accordion objects
         */
        init: function( userConfig ) {

            /* Use user configuration if provided */
            var config = Functions.extend( defaultConfig, userConfig );

            var accordions = [],
                accordionGroups = document.querySelectorAll( config.selector.wrapper ),
                currentAccordion;

            for( var i = accordionGroups.length; i--; ) {
                try {
                    currentAccordion = new Accordion(
                        accordionGroups[i],
                        accordionGroups[i].querySelectorAll( config.selector.section ),
                        accordionGroups[i].dataset.tabaccordionType,
                        config
                    );

                    module.initialOpenGroup( currentAccordion );

                    /* Autoplay for this tabaccordion */
                    if( config.autoPlay.enabled ) {
                        module.autoPlay( currentAccordion );
                    }

                    /* Store a reference to return */
                    accordions.push( currentAccordion );
                }
                catch( error ) {
                    console.error( error.stack );
                }
            }
            /* Return the list of accordion elements for further manipulation */
            return accordions;
        },

        /**
         * Open an accordion element on initialization
         *
         * @param {Accordion} accordion
         */
        initialOpenGroup: function( accordion ) {

            /* Check if explicitly is defined to leave all elements closed by data attribute `data-panel-group-all-closed` */
            if( typeof accordion.wrapper.dataset.tabaccordionAllClosed !== 'undefined' ) {
                return;
            }

            var groupOpen = 0;

            /* TabbedContent always opens the first tab, so we need to close it */
            accordion.close( 0 );

            /* Open a specified accordion element if specified by data attribute, e.g. 'data-panel-group-open="2"', else open first element */
            if( accordion.wrapper.dataset.tabaccordionOpen ) {
                groupOpen = parseInt( accordion.wrapper.dataset.tabaccordionOpen, 10 );

                if( groupOpen >= 1 ) {
                    groupOpen--;
                }
                else {
                    groupOpen = 0;
                }
            }
            else {
                /* Open the accordion element that already has the showSectionClass set. */
                for( var i = 0, len = accordion.length; i < len; i++ ) {
                    if( accordion.sections[i].classList.contains( accordion.config.showSectionClass ) ) {
                        groupOpen = i;
                        break;
                    }
                }
            }

            accordion.open( groupOpen );
        },

        /**
         * @param {Accordion} accordion
         */
        autoPlay: function( accordion ) {

            var stopOnHoverElements,
                pauseAutoPlay = false,
                isManuallyPaused = false;

            if( accordion.config.autoPlay.stopOnHover ) {
                if( !!accordion.config.autoPlay.stopOnHoverSelector ) {
                    stopOnHoverElements = accordion.wrapper.querySelectorAll( accordion.config.autoPlay.stopOnHoverSelector );
                }
                else {
                    stopOnHoverElements = accordion.wrapper;
                }

                if( stopOnHoverElements instanceof NodeList ) {
                    /* Pause on mouse over */
                    Functions.on( document.body, 'mouseover', stopOnHoverElements, function() {
                        if( !isManuallyPaused ) {
                            pauseAutoPlay = true;
                        }
                    } );

                    /* Autoplay on mouse out */
                    Functions.on( document.body, 'mouseout', stopOnHoverElements, function() {
                        if( !isManuallyPaused ) {
                            pauseAutoPlay = false;
                        }
                    } );
                }
            }

            document.addEventListener( 'tabaccordion-pause', function() {
                isManuallyPaused = true;
                pauseAutoPlay = true;
            }, false );

            document.addEventListener( 'tabaccordion-resume', function() {
                isManuallyPaused = false;
                pauseAutoPlay = false;
            }, false );

            setInterval( function() {
                if( !pauseAutoPlay ) {
                    var currentItem = Array.prototype.indexOf.call( accordion.sections, accordion.activeSection );
                    if( currentItem === accordion.length - 1 ) {
                        accordion.open( 0 );
                    }
                    else {
                        accordion.open( currentItem + 1 );
                    }
                }
            }, accordion.config.autoPlay.delay );

        }

    };

    return module;

} );
